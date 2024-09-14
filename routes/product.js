const router = require("express").Router();
const {
  getAllProductsAdmin,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
  getProductReviews,
  createProductReview,
  updateProductReview,
  getProductBySlug,
} = require("../controllers/products.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

router
  .route("/adm")
  .get(verifyToken, verifyAdmin, getAllProductsAdmin)

router
  .route("/")
  .post(verifyToken, verifyAdmin, createProduct);

router
  .route("/:slug")
  .get(getProductBySlug)
  // .get(getProduct)
  // .get(getProductByName)
  .put(verifyToken, verifyAdmin, updateProduct)

router
  .route("/:id")
  .delete(verifyToken, verifyAdmin, deleteProduct);

router
  .route("/:id/reviews")
  .get(getProductReviews)
  .post(verifyToken, createProductReview)
  .put(verifyToken, updateProductReview);

module.exports = router;
