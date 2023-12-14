const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");
const { attachCookieToResponse } = require("../utils");
const { createTokenUser } = require("../utils");

class AuthController {
  static async register(req, res) {
    const { name, email, password } = req.body;
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      throw new CustomErrors.BadRequestError("Please provide a unique email.");
    }

    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? "admin" : "user";
    const user = await User.create({ name, email, password, role });
    const tokenUser = createTokenUser(user);

    attachCookieToResponse(res, tokenUser);

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
  }
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomErrors.BadRequestError("Please fill in all the fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomErrors.UnauthenticatedError("Invalid credentials");
    }
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      throw new CustomErrors.UnauthenticatedError("Invalid credentials");
    }

    const tokenUser = createTokenUser(user);
    attachCookieToResponse(res, tokenUser);
    res.status(StatusCodes.OK).json({ user: tokenUser });
  }
  static async logout(req, res) {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "user logged out" });
  }
}

module.exports = AuthController;
