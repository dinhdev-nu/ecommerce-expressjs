'use strict'
const { BadRequestError } = require("../core/error.respon")
const discountModel = require("../models/discount.model")
const { Inventory, InventoryHistory } = require("../models/inventory.model")
const { product } = require("../models/product.model")
const orderModel = require("../models/order.model")
const { Types } = require("mongoose")

// This is test code. Need to fix in the future
const orderConfirm = async(payload) => {
    try {
        const { 
            orderId, order_items,
            // order_payment   
        } = payload
        
        
        
        // Kiem tra order co ton tai khong
        const order = await orderModel.findById(orderId).lean()
        if(!order) throw new BadRequestError('Order not found ! Please check again')
        if(order.order_status !== 'pending') throw new BadRequestError('Order has been processed')
                
        // check prouduct availability
        // lock product item in inventory

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

        if(checkListProduct.length > 0) throw new BadRequestError(`Some products are not available or changed price`);

        // check discount code
        const discount_ids = [...new Set(order_items.map(item => item.discount_id).filter(Boolean))]
        const foundDiscount = discount_ids.length ? await discountModel.find({ 
            _id: { $in: discount_ids }
        }).lean() : []

        if (discount_ids.length > 0 && 
            ( foundDiscount.length === 0 || new Set(discount_ids).size !== discount_ids.length )
        )  throw new BadRequestError("No valid discount codes provided.");

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

        // check final price
        order_items.forEach((item) => {
            const product = inventory.find(i => i.inventory_productId._id.toString() === item.product_id)
            const discount = foundDiscount.find(d => d._id.toString() === item.discount_id)
            // calculate discount
            const basePrice = product.inventory_productId.product_price * item.product_quantity
            let discountAmount = 0
            if(discount){
                discountAmount = discount.discount_type === 'percentage' ? 
                    basePrice * discount.discount_value / 100 : 
                    discount.discount_value
            }
            if(Math.abs(basePrice - discountAmount - item.final_price) > 0.01){
                throw new BadRequestError('Product changed price! Please check again')
            }

        })

        // update inventory
        const updateInventory = async () => {
            const promise = order_items.map(async item => {
                const inventory = await Inventory.findOneAndUpdate({
                    inventory_productId: item.product_id
                }, {
                    $inc: {
                        inventory_stock: - item.product_quantity
                    }
                })
                await InventoryHistory.create({
                    inventory_id: inventory._id,
                    action: 'deduct',
                    quantity: -item.product_quantity
                })
            })
            await Promise.all(promise)
        }

        const bulkProduct = order_items.map(item => {
            return {
                updateOne: {
                    filter: {
                        _id: new Types.ObjectId(item.product_id)
                    },
                    update: {
                        $inc: {
                            product_quantity: - item.product_quantity
                        }
                    }
                }
            }
        })

        let bulkDiscount 
        if( discount_ids.length > 0 ){
            bulkDiscount = foundDiscount.map(d => ({
                updateOne: {
                    filter: { _id: d._id },
                    update: { $inc: { discount_current_usage: 1 } }
                }
            }))
        }
        
        const updateOrder = await orderModel.findByIdAndUpdate(
            orderId
            , {
            order_status: 'paid',
            order_expiredAt: null , // remove expire time
        }, {
            new: true
        })

        if(!updateOrder) throw new BadRequestError('Order not found or already updated')

        await Promise.all([
            product.bulkWrite(bulkProduct),
            bulkDiscount ? discountModel.bulkWrite(bulkDiscount) : Promise.resolve(),
            updateInventory()
        ]).catch(err => {
            throw new BadRequestError('Update product failed')
        })
        

        return {
            orderId: order._id,
            order_total: order.order_total,
            order_items: order.order_items,
            order_status: updateOrder.order_status,
        }
        

    } catch (error) {
        console.log(error)
       throw new BadRequestError("Order create failed")
    }
}

module.exports = {
    orderConfirm
}