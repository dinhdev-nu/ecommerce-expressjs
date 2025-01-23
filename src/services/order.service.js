'use strict'

const { NotFoundError } = require("../core/error.respon")
const discountModel = require("../models/discount.model")
const { Inventory, InventoryHistory } = require("../models/inventory.model")
const _ = require('lodash')
const orderModel = require("../models/order.model")

/**
 * 
 * @param {} payload :
 * {
  "order_userId": "user_id",
  "order_items": [
    { "product_id": "product_id_1", "product_quantity": 2, "product_price": 100 },
    { "product_id": "product_id_2", "product_quantity": 1, "product_price": 200 }
  ],
  "order_payment": { "method": "paypal" },
  "order_address": {
    "full_name": "John Doe",
    "address": "123 Main Street",
    "city": "New York",
    "postal_code": "10001",

    "country": "USA"
  },
  "order_notes": "Leave at the front door",
  "order_discount": [
        {"discount_code": "DISCOUNT10", "discount_amount": 50, discount_for_product: "12421342112314e" }
   ]
}
    * @returns {
  "message": "Order created successfully",
  "data": {
    "orderId": "order_id",
    "order_total": 350,
    "order_status": "pending"
  }
}


 * 
 */

const createOrder = async (payload) => {
    try {
        
        const { 
            order_userId, order_items,
            order_payment, order_address,   
            order_note, order_discount
        } = payload

        // check prouduct availability

        const product_ids = order_items.map(item => item.product_id)
        const filter = {
            inventory_productId: {
                $in: product_ids
            }
        }
        const inventory = await Inventory.find(filter)
                        .populate('inventory_productId', 'product_price', 'isPublic')
                        .select('inventory_productId inventory_stock')
        
        
        const checkListProduct = order_items.filter(item => {
            const valid = inventory.find(inv => {
                return inv.inventory_productId._id.toString() === item.product_id
            })
            return !valid || 
                valid.inventory_stock < item.product_quantity || 
                !valid.inventory_productId.isPublic 
        })

        if(checkListProduct.length > 0){
            throw new Error(
                `Invalid or expired discount codes: ${checkListProduct
                  .map((d) => d.discount_code)
                  .join(', ')}`
              );
        }

        // check discount code
        const discount_code = order_discount.map(d => d.discount_code)
        const foundDiscount = await discountModel.find({ 
            discount_code: { $in: discount_code }
        }).lean()

        if (!foundDiscount || foundDiscount.length === 0 && order_discount.length > 0) {
            throw new Error("No valid discount codes provided.");
        }

        const checkListDiscount = order_discount.filter(dis => {
            const valid = foundDiscount.find(d => {
                return d.discount_code === dis.discount_code && 
                    d.discount_is_active && 
                    ( d.discount_apply_to === "all" || d.discount_specific_products.includes(dis.discount_for_product) )    
            })
            return !valid
        })

        if(checkListDiscount.length > 0){
            throw new Error(
                `Invalid or expired discount codes: ${checkListDiscount
                  .map((d) => d.discount_code)
                  .join(', ')}`
              );
        }
        // check count

        const order_discount_total = order_discount.reduce((total, dis) => {
            const valid = foundDiscount.find(d => {
                return dis.discount_code === d.discount_code
            })
            return total + ( valid ?  dis.discount_amount : 0 )
        }, 0)

        const order_total = order_items.reduce((total, item) => {
            const product = inventory.find(i => i.inventory_productId.toString() === item.product_id)
            return total + product.inventory_productId.product_price * item.product_quantity
        })
        
        const order_total_final = order_total - order_discount_total

        const newOrder = await orderModel.create({
            order_userId,
            order_items,
            order_payment,
            order_address,
            order_note,
            order_discount,
            order_total: order_total_final,
            order_status: "pending"
        })
        if(!newOrder){
            throw new Error('Order create failed')
        }


        // update inventory + transaction

        // CACH 1 FASTER
        // const session = await Inventory.startSession()
        // session.startTransaction()

        // try {
        //     const updateIventory = order_items.map( async item => {
        //         const validIventory = inventory.find(inv => {
        //             return inv.inventory_productId._id.toString() === item.product_id
        //         })
        //         if(validIventory){
        //             validIventory.inventory_stock -= item.product_quantity
        //             await validIventory.save({ session })

        //             await InventoryHistory.create({
        //                 inventory_id: validIventory._id,
        //                 quantity: -item.product_quantity,
        //                 action: 'deduct'
        //             }, { session })
        //         }
        //     })
        //     await Promise.all(updateIventory)
        // } catch (error) {
        //     await session.abortTransaction()
        //     throw new Error('Order update inventory failed')
            
        // } finally {
        //     session.endSession()
        // } 

        try {
            const session = await Inventory.startSession()
            session.startTransaction()

            for(const item of order_items){
                const validIventory = inventory.find(inv => {
                    return inv.inventory_productId._id.toString() === item.product_id
                })
                if(validIventory){
                    validIventory.inventory_stock -= item.product_quantity
                    await validIventory.save({ session })

                    // create history inventory
                    await InventoryHistory.create({
                        inventory_id: validIventory._id,
                        quantity: -item.product_quantity,
                        action: 'deduct'
                    }, { session })
                }
            }

            await session.commitTransaction()

        } catch (error) {
            await session.abortTransaction()
            throw new Error('Order update inventory failed')
        } finally { 
            session.endSession()
        }


        return {
            orderId: newOrder._id,
            order_total: order_total_final,
            order_status: "pending"
        }
        

    } catch (error) {
        throw error
    }
}

const getDetailOrder = async ({orderId, order_userId}) => {
    try {
        const unSelect = ['-createdAt', '-updatedAt', '-__v']
        return await orderModel.findOne({ _id: orderId, order_userId }, )
                                .select(unSelect)
                                .lean()
    } catch (error) {
        throw error
    }
}

const updateStatusOrder = async ({orderId, order_userId, order_status}) => {
    const foundOrder = await orderModel.findOne({ _id: orderId, order_userId })
    if(!foundOrder){
        throw new NotFoundError('Order not found')
    }
    foundOrder.order_status = order_status
    if(order_status === 'paid'){
        foundOrder.order_payment.payment_status = 'paid'
    }
    return await orderModel.findOneAndUpdate(filter, update, options)

}

const cancelOrder = async ({orderId, order_userId}) => {
    const foundOrder = await orderModel.findOne({ _id: orderId, order_userId })
    if(!foundOrder){
        throw new NotFoundError('Order not found')
    }
    foundOrder.order_status = 'cancelled',
    foundOrder.order_payment.payment_status = 'failed'
    return await foundOrder.save() 
}

const getlistOrderForUser = async ({userId}) => {
    const unSelect = ['-createdAt', '-updatedAt', '-__v']
    return await orderModel.find({ order_userId: userId })
                            .select(unSelect)
                            .lean()
}

module.exports = {
    createOrder,
    getDetailOrder,
    updateStatusOrder,
    cancelOrder,
    getlistOrderForUser
}
/**
 * 2. Get Order Details
Endpoint: GET /api/orders/:orderId
Mục đích: Lấy chi tiết một đơn hàng.
 * 3. Update Order Status
Endpoint: PATCH /api/orders/:orderId/status
 * 4. Cancel Order
Endpoint: PATCH /api/orders/:orderId/cancel
 * 5. List User's Orders
Endpoint: GET /api/users/:userId/orders
 * 6. List All Orders (Admin)
Endpoint: GET /api/orders
 */
