const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.route("/register").post(AuthController.register);
router.route("/login").post(AuthController.login);
router.route("/logout").get(AuthController.logout);

module.exports = router;
