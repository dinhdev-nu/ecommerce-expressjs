"use strict";
const { SuccessResponse } = require("../response/success.respon");
const ProductFactory = require("../services/product.service");

class ProductController {
  create = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created",
      metadata: await ProductFactory.createProduct({
        type: req.body.product_type,
        payload: req.body,
      }),
    }).send(res);
  };
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await ProductFactory.updateProduct({
        product_id: req.params.product_id,
        payload: req.body,
        type: req.body.product_type,
      }),
    }).send(res);
  };
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete product successfully",
      metadata: await ProductFactory.deleteProduct(req.params.product_id),
    }).send(res);
  };

  // GET
  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products",
      metadata: await ProductFactory.getAllProducts({
        limit: req.query.limit,
        page: req.query.page,
        sort: req.query.sort,
      }),
    }).send(res);
  };
  getProductDetail = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product detail",
      metadata: await ProductFactory.getProductDetail(req.params.product_id),
    }).send(res);
  };

  searchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Search product",
      metadata: await ProductFactory.searchProduct(req.query.q),
    }).send(res);
  };

  getAllProductsByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products by shop",
      metadata: await ProductFactory.getAllProductsByShop(req.user.userId),
    }).send(res);
  };
  getProductDraftsByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product drafts by shop",
      metadata: await ProductFactory.getProductDraftsByShop(req.user.userId),
    }).send(res);
  };

  getProductPublishedByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product published by shop",
      metadata: await ProductFactory.getProductPublishedByShop(
        req.params.shop_id
      ),
    }).send(res);
  };
  filterProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Filter product",
      metadata: await ProductFactory.filterProduct(req.query),
    }).send(res);
  };
  // UPDATE
  updateProductDraft = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product draft",
      metadata: await ProductFactory.updateProductDraft(req.params.product_id),
    }).send(res);
  };
  updateProductPublished = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product published",
      metadata: await ProductFactory.updateProductPublished(
        req.params.product_id
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
