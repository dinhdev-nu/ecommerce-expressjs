const { product, clothing, furniture, electrics } = require("../product.model")
const { getUnSelect, getSelect } = require('../../utils/index')

// GET
const getAllProducts = async ({limit, page, sort, select}) => {
    const skip = (+page -1) * +limit
    const sortBy = sort = 'ctime' ? {createdAt: -1} : {product_price: 1}
    const SELECT = getSelect(select)
    return await product.find({isPublic: true, isDraft: false})
                .limit(+limit)
                .skip(skip)
                .sort(sortBy)
                .select(SELECT)
                .lean()
}
const getOneProductPublish= async (product_id) => {
    const fillter = {
        _id: product_id,
        isDraft: false,
        isPublic: true
    }
    return await product.findOne(fillter).lean()
}
const getOneProductDraft = async (product_id) => {
    const fillter = {
        _id: product_id,
        isDraft: true,
        isPublic: false
    }
    return await product.findOne(fillter).lean()
}
const getAllProductsByShop = async ({ shopId, unSelect }) => {
    unSelect = getUnSelect(unSelect)
    return await product.find({ product_shop: shopId })
                .select(unSelect)
                .lean()
}
const getProductDraftsByShop = async ({ shopId, unSelect }) => {
    unSelect = getUnSelect(unSelect)
    return await product.find({ product_shop: shopId, isDraft: true, isPublic: false })
                .select(unSelect)
                .lean()
}
const getProductPublishedByShop =async ({ shopId, unSelect }) => {
    unSelect = getUnSelect(unSelect)
    return await product.find({ product_shop: shopId, isPublic: true, isDraft: false })
                .select(unSelect)
                .lean()
}
const searchProduct = async (keySearch) => {
    const select = getSelect(['_id', 'product_name', 'product_price', 'product_thumb'])
    return await product.find({
        $text: {
            $search: keySearch
        },
        isPublic: true,
        isDraft: false
    },
    { score: { $meta: 'textScore' } }
    ).sort({
        score: {
            $meta: "textScore"
        }
    }).select(select).lean()
}

const filterProduct = async (fillter) => {
    return await product.find(fillter).lean()
}

// UPDATE

const update = async ({ product_id, payload, model }) => {
    const options = {
        new: true
    }
    return await model.findByIdAndUpdate( product_id, payload, options ).lean()
}   

const updateProductDraft = async ( product_id ) => {
    const options = {
        new: true
    }, select = getSelect(['product_name', 'isDraft', 'isPublic'])
    return await product.findByIdAndUpdate(
        product_id, 
        { isDraft: true, isPublic: false },
        options
    ).select(select).lean()
}

const updateProductPublished = async ( product_id ) => {
    const options = {
        new: true
    }, select = getSelect(['product_name', 'isDraft', 'isPublic'])
    return await product.findByIdAndUpdate( 
        product_id, 
        { isDraft: false, isPublic: true },
        options
    ).select(select).lean()
}

// DELETE

const deleteProduct = async ({product_id, model}) => {
    const fillter = {
        _id: product_id,
        isDraft: true,
        isPublic: false
    }
    console.log(model)
    return await model.deleteOne(fillter)
}
const deleteChildProduct = async ({product_id, model}) => {
    const fillter = {
        _id: product_id,
    }
    return await model.deleteOne(fillter)
}
module.exports = {
    getAllProducts, getAllProductsByShop, getProductDraftsByShop,
    getProductPublishedByShop, searchProduct, update,
    updateProductDraft, updateProductPublished, deleteProduct,
    getOneProductPublish, deleteChildProduct, getOneProductDraft,
    filterProduct
}