'use strict'

const { BadRequestError } = require("../core/error.respon")
const { product, clothing, furniture, electrics } = require("../models/product.model")
const { 
    getAllProducts, searchProduct, getAllProductsByShop, 
    getProductDraftsByShop, getProductPublishedByShop,
    updateProductDraft, updateProductPublished,
    deleteProduct, update, getOneProductPublish,
    getOneProductDraft,
    deleteChildProduct,
    filterProduct
} = require("../models/repositories/product.repo")
const { flattenNestedObject, removeEmptyValuesForPayload } = require("../utils")
const { createInventoryForProduct } = require("./inventory.service")

class ProductFactory {
    //POST create product
    static list_type = {}
    static set_to_list_type(type, classRef){
        ProductFactory.list_type[type] = classRef 
    }
    static async createProduct({type, payload}){
        const classRef = ProductFactory.list_type[type]
        if(classRef){
            return await new classRef(payload).createProduct()
        }
        throw new BadRequestError("Invalid type")
    }

    // GET product
    static async getAllProducts({limit = 40, page = 1, sort = 'ctime'}){
        return await getAllProducts({limit, page, sort, 
            select : ['product_name', 'product_price', 'product_thumb', 'product_quantity']
        })
    }

    static async searchProduct(keySearch){
        return await searchProduct(keySearch)
    }
    static async getAllProductsByShop( shopId ){
        const unSelect = 
        ['updatedAt', '__v', 'product_shop', 
        'product_slug', 'product_average_rating',
        'product_variation'
        ]
        return await getAllProductsByShop({ shopId, unSelect })
    }
    static async getProductDraftsByShop( shopId ){
        const unSelect = 
        ['updatedAt', '__v', 'product_shop', 
        'product_slug', 'product_average_rating',
        'product_variation'
        ]
        return await getProductDraftsByShop({ shopId, unSelect })
    }
    static async getProductPublishedByShop( shopId ){
        const unSelect = ['createdAt', 'updatedAt', '__v']
        return await getProductPublishedByShop({ shopId, unSelect })
    }
    static async filterProduct(query){
        const {product_type, product_price, shop_name, brand} = query
        const filter = {}
        if(product_type) filter.product_type = product_type 

        if(product_price)  filter.product_price.$lte = product_price + product_price * 0.1 

        if(shop_name) filter.product_shop = shop_name
        
        if(brand) filter.product_attributes.brand = brand
        
        filter.isPublic = true
        filter.isDraft = false

        const products = await filterProduct(filter)

        return products ? products : null
    }
    // UPDATE product
    static async updateProduct({product_id, payload, type}){
        if(!type){
            throw new BadRequestError("Invalid type")
        }
        const findProduct = await getOneProductPublish(product_id)
        if(findProduct){
            throw new BadRequestError("Product is published! Pls Change to draft to update!")
        } 
        const classRef = ProductFactory.list_type[type]
        if(classRef){   
            return await new classRef(payload).updateProduct(product_id) 
        }
    }
    static async updateProductDraft(product_id){
        return await updateProductDraft(product_id)
    }
    static async updateProductPublished(product_id){
        return await updateProductPublished(product_id)
    }
    // DELETE product
    static async deleteProduct(product_id){
        const product = await getOneProductDraft(product_id)
        if(!product){
            throw new BadRequestError("Product is published or not found! Pls Change to draft to delete!")
        }
        
        const classRef = ProductFactory.list_type[product.product_type]
        
        return await new classRef({}).deleteProduct(product_id)
    }

}

class ProductService {
    constructor({   
        product_name, product_price, product_description, product_thumb,
        product_quantity, product_shop, product_type, product_attributes
    }){
        this.product_name = product_name
        this.product_price = product_price
        this.product_description = product_description
        this.product_thumb = product_thumb
        this.product_quantity = product_quantity
        this.product_shop = product_shop
        this.product_type = product_type
        this.product_attributes = product_attributes
    }

    async createProduct(prouduct_id){
        const newProduct = await product.create({
            ...this,
            _id: prouduct_id
        })
        if(newProduct){
            createInventoryForProduct({
                shop_id: this.product_shop, 
                product_id: prouduct_id, 
                inventory: { inventory_stock: this.product_quantity }
            })
        }
        return newProduct
    }

    async updateProduct(product_id){
        const payload = flattenNestedObject(this)
        const updateProduct = await update({product_id, payload, model: product})
        if(!updateProduct){
            throw BadRequestError("Update product failed")
        }
        return updateProduct
    }

    async deleteProduct(product_id){
        const dltProduct = await deleteProduct({ product_id, model: product })
        return dltProduct
    }
}

class Clothing extends ProductService {
    
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop

        })
        if(!newClothing){
            throw BadRequestError("Can't create new product")
        }
        const newProduct =  await super.createProduct(newClothing._id)
        return newProduct
    }

    async updateProduct(product_id){
        const { product_attributes } = removeEmptyValuesForPayload(this)
        const updateProduct = await super.updateProduct(product_id)
        
        const updateClothing = await update({
            product_id, payload: product_attributes, model: clothing
        })
        return {
            "Product": updateProduct,
            "Clothing": updateClothing
        }
    }
    async deleteProduct(product_id){
        const dltProduct = await super.deleteProduct(product_id)
        if(!dltProduct || dltProduct.modifiedCount === 0){
            throw new BadRequestError("Delete product failed!")
        }
        const deleteProductChild = await deleteChildProduct({product_id, model: clothing})
        return {
            "Product": dltProduct,
            "Clothing": deleteProductChild
        }
    }
}

class Furniture extends ProductService {
    
    async createProduct(){
        const newClothing = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if(!newClothing){
            throw BadRequestError("Can't create new product")
        }
        
        const newProduct =  await super.createProduct(newClothing._id)
        return newProduct
        
    }
    async updateProduct(product_id){
        const { product_attributes } = removeEmptyValuesForPayload(this)
        const updateProduct = await super.updateProduct(product_id)
        
        const updateFurniture = await update({
            product_id, payload: product_attributes, model: furniture
        })
        return {
            "Product": updateProduct,
            "Furniture": updateFurniture
        }
    }

    async deleteProduct(product_id){
        const dltProduct = await super.deleteProduct(product_id)
        if(!dltProduct || dltProduct.modifiedCount === 0){
            throw new BadRequestError("Delete product failed!")
        }
        const deleteProductChild = await deleteChildProduct({product_id, model: furniture})
        return {
            "Product": dltProduct,
            "Furniture": deleteProductChild
        }
    }
}

class Electrics extends ProductService {
    
    async createProduct(){
        const newClothing = await electrics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing){
            throw BadRequestError("Can't create new product")
        }
        
        const newProduct =  await super.createProduct(newClothing._id)
        return newProduct
        
    }
    async updateProduct(product_id){
        const { product_attributes } = removeEmptyValuesForPayload(this)
        const updateProduct = await super.updateProduct(product_id)
        
        const updateElectrics = await update({
            product_id, payload: product_attributes, model: electrics
        })
        return {
            "Product": updateProduct,
            "Electrics": updateElectrics
        }
    }

    async deleteProduct(product_id){
        const dltProduct = await super.deleteProduct(product_id)
        if(!dltProduct || dltProduct.modifiedCount === 0){
            throw new BadRequestError("Delete product failed!")
        }
        const deleteProductChild = await deleteChildProduct({product_id, model: electrics})
        return {
            "Product": dltProduct,
            "Electrics": deleteProductChild
        }
    }
}

ProductFactory.set_to_list_type("Clothing", Clothing);
ProductFactory.set_to_list_type("Furniture", Furniture);
ProductFactory.set_to_list_type("Electronics", Electrics);


module.exports = ProductFactory