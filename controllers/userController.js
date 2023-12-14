const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");
const {
  createTokenUser,
  attachCookieToResponse,
  checkPermissions,
} = require("../utils/");

class UserController {
  static async getAllUsers(req, res) {
    const users = await User.find({ role: "user" }).select("-password");
    return res.status(StatusCodes.OK).json({ users });
  }
  static async getSingleUser(req, res) {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      throw new CustomErrors.NotFoundError("user not found");
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  }
  static async showCurrentUser(req, res) {
    const user = req.user;
    res.status(StatusCodes.OK).json({ user });
  }
  static async updateUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new CustomErrors.BadRequestError("please fill in all the fields.");
    }
    const { userId } = req.user;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email },
      { new: true, runValidators: true }
    );

    const tokenUser = createTokenUser(user);
    attachCookieToResponse(res, tokenUser);
    res.status(StatusCodes.OK).json({ user: tokenUser });
  }
  static async updateUserPassword(req, res) {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new CustomErrors.BadRequestError("Please fill in all the fields");
    }
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });
    const isValidPassword = await user.isValidPassword(oldPassword);

    if (!isValidPassword) {
      throw new CustomErrors.UnauthorizedError("Invalid credentials");
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "password updated successfully" });
  }
}

module.exports = UserController;
