'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.respon")
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
    { "product_id": "product_id_1", "product_quantity": 2, "product_price": 100, "discount_id": "discount_id", final_price: 90 },
    { "product_id": "product_id_2", "product_quantity": 1, "product_price": 200, "discount_id": "discount_id", final_price: 180 }
  ],
  "order_address": {
    "full_name": "John Doe",
    "phone": "0123456789",
    "ward": "Ward 1",
    "district": "District 1",
    "city": "City 1"
  },
}
    * @returns {
  "message": "Order created successfully",
  "data": {
    "orderId": "order_id",
    "order_total": 370,
    "order_items": ,
    "order_status": "pending"
  }
}


 * 
 */

const createOrder = async (payload) => {
    try {
        
        const { 
            order_userId, order_items, order_address,   
        } = payload

        // check prouduct availability
        const productIds = order_items.map(item => item.product_id)
        const filter = {
            inventory_productId: {
                $in: productIds
            }
        }
        const inventory = await Inventory.find(filter)
                        .populate('inventory_productId', 'product_name product_price isPublic')
                        .select('inventory_productId inventory_stock')
                        .lean()
        
        
        const checkListProduct = order_items.filter(item => {
            const valid = inventory.find(inv => {
                return inv.inventory_productId._id.toString() === item.product_id
            })
            return !valid || 
                valid.inventory_stock < item.product_quantity || 
                !valid.inventory_productId.isPublic ||
                valid.inventory_productId.product_price !== item.product_price
        })

        if(checkListProduct.length > 0){
            throw new BadRequestError(`Some products are not available or changed price`);
        }

        // check discount code
        const discount_ids = [...new Set(order_items.map(item => item.discount_id).filter(Boolean))]
        const foundDiscount = discount_ids.length ? await discountModel.find({ 
            _id: { $in: discount_ids }
        }).lean() : []

        if (discount_ids.length > 0 && 
            foundDiscount.length === 0 || 
            new Set(discount_ids).size !== discount_ids.length) {
            throw new BadRequestError("No valid discount codes provided.");
        }

        if(discount_ids.length > 0){
            const checkListDiscount = order_items.filter(item => {
                if(!item.discount_id) return false
                const discount = foundDiscount.find(d => d._id.toString() === item.discount_id)
                
                return !discount || !discount.discount_is_active ||
                    discount.discount_start_date > new Date() ||
                    discount.discount_end_date < new Date() ||
                    discount.discount_current_usage >= discount.discount_max_usage ||
                    (discount.discount_apply_to !== "all" && !discount.discount_specific_products.includes(item.product_id));
            })
    
            if(checkListDiscount.length > 0 ){
                throw new BadRequestError(`Invalid or expired discount codes 2`);
            }
        }
        // check count
        let orderTotal = 0, discountTotal = 0

        order_items.forEach((item) => {
            const product = inventory.find(i => i.inventory_productId._id.toString() === item.product_id)
            const discount = foundDiscount.find(d => {
                return d._id.toString() === item.discount_id
            })
            // calculate discount
            const basePrice = product.inventory_productId.product_price * item.product_quantity
            let discountAmount = 0
            if(discount){
                discountAmount = discount.discount_type === 'percentage' ? 
                    basePrice * discount.discount_value / 100 : 
                    discount.discount_value
            }
            if(basePrice - discountAmount !== item.final_price){
                throw new BadRequestError('Product changed price! Please check again')
            }

            item.product_name = product.inventory_productId.product_name
            item.discount_amount = discountAmount
            orderTotal += basePrice
            discountTotal += discountAmount

        })
        
        const orderTotalFinalPrice = orderTotal - discountTotal

        // create order
        const newOrder = await orderModel.create({
            order_userId,
            order_items,
            order_address,
            order_total: orderTotalFinalPrice,
            order_status: "pending"
        })
        if(!newOrder){
            throw new Error('Order create failed')
        }
        return {
            orderId: newOrder._id,
            order_total: newOrder.order_total,
            order_items: newOrder.order_items,
            order_status: newOrder.order_status,
            order_date: newOrder.createdAt
        }

        if(order_payment){
            try {

                for(const item of order_items){
                    const validIventory = inventory.find(inv => {
                        return inv.inventory_productId._id.toString() === item.product_id
                    })
                    if(validIventory){
                        validIventory.inventory_stock -= item.product_quantity
                        await validIventory.save()
    
                        // create history inventory
                        await InventoryHistory.create({
                            inventory_id: validIventory._id,
                            quantity: -item.product_quantity,
                            action: 'deduct'
                        })
                    }
                }
    
    
            } catch (error) {
                throw new Error('Order update inventory failed')
            } 
        }


        return {
            orderId: newOrder._id,
            order_total: newOrder.order_total,
            order_items: newOrder.order_items,
            order_status: "pending"
        }
        

    } catch (error) {
        console.log(error)
       throw new BadRequestError("Order create failed")
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
