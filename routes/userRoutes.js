const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(
    authenticateUser,
    authorizePermissions("admin"),
    UserController.getAllUsers
  );
router.route("/showMe").get(authenticateUser, UserController.showCurrentUser);
router.route("/updateUser").patch(authenticateUser, UserController.updateUser);
router
  .route("/updateUserPassword")
  .patch(authenticateUser, UserController.updateUserPassword);
router.route("/:id").get(authenticateUser, UserController.getSingleUser);

module.exports = router;
