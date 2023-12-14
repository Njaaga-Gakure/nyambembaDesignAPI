const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");
const path = require("path");

class ProductController {
  static async createProduct(req, res) {
    const { userId } = req.user;
    req.body.user = userId;
    const product = await Product.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ product });
  }
  static async getAllProducts(req, res) {
    const products = await Product.find({});
    // const products = await Product.find({}).populate({
    //   path: "user",
    //   select: "name email",
    // });
    res.status(StatusCodes.OK).json({ products, count: products.length });
  }
  static async getSingleProduct(req, res) {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new CustomErrors.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
  }
  static async updateProduct(req, res) {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      throw new CustomErrors.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
  }
  static async deleteProduct(req, res) {
    const { id: productId } = req.params;
    const product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
      throw new CustomErrors.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ msg: "product removed successfully" });
  }
  static async uploadImage(req, res) {
    if (!req.files) {
      throw new CustomErrors.BadRequestError("No file uploaded");
    }
    const { name: productName, mimetype, size, mv } = req.files.image;
    if (!mimetype.startsWith("image")) {
      throw new CustomErrors.BadRequestError(
        "The file uploaded is not an image"
      );
    }
    const maxSize = 1024 * 1024;
    if (size > maxSize) {
      throw new CustomErrors.BadRequestError(
        "Please do not upload images exceeding 1 MB"
      );
    }

    const imagePath = path.join(__dirname, `../public/uploads/${productName}`);
    await mv(imagePath);
    res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${productName}` } });
  }
}

module.exports = ProductController;
