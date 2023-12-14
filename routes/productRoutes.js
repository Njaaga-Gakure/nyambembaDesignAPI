const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    ProductController.createProduct
  )
  .get(ProductController.getAllProducts);

router
  .route("/uploadImage")
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    ProductController.uploadImage
  );
router
  .route("/:id")
  .get(ProductController.getSingleProduct)
  .patch(
    authenticateUser,
    authorizePermissions("admin"),
    ProductController.updateProduct
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    ProductController.deleteProduct
  );

module.exports = router;
