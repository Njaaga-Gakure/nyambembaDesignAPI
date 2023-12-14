const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field can not be empty"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email field can not be empty"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email.",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password field can not be empty"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = model("User", UserSchema);
