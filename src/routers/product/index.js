"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helpers/catch.error");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = Router();

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/search", asyncHandler(productController.searchProduct));
router.get(
  "/shop/publish/:shop_id",
  asyncHandler(productController.getProductPublishedByShop)
);
router.get("/filter", asyncHandler(productController.filterProduct));
router.get(
  "/detail/:product_id",
  asyncHandler(productController.getProductDetail)
);

router.use(asyncHandler(authentication));
// create
router.post("/", asyncHandler(productController.create));

// update
router.put("/update/:product_id", asyncHandler(productController.update));
router.patch(
  "/update/draft/:product_id",
  asyncHandler(productController.updateProductDraft)
);
router.patch(
  "/update/publish/:product_id",
  asyncHandler(productController.updateProductPublished)
);

// delete
router.delete("/delete/:product_id", asyncHandler(productController.delete));

// get
router.get(
  "/shop/draft",
  asyncHandler(productController.getProductDraftsByShop)
);
router.get(
  "/shop/products",
  asyncHandler(productController.getAllProductsByShop)
);

module.exports = router;
