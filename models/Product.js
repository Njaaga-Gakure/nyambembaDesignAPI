const { Schema, model, Types } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [50, "Name can not exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not exceed 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/default.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category."],
      enum: {
        values: [
          "branding",
          "printing",
          "signage",
          "engraving",
          "stamp",
          "seal",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // inventory: {
    //   type: Number,
    //   default: 15,
    // },
    // averageRating: {
    //   type: Number,
    //   default: 0,
    // },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Product", ProductSchema);
