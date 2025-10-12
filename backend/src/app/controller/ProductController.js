const Product = require("../models/Products");
const Variant = require("../models/Variants");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalProducts = await Product.countDocuments();

      const products = await Product.find()
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        page,
        limit,
        totalPages,
        totalProducts,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const userId = req.user.userId;
      console.log(userId);

      if (!userId) {
        return res.status(400).json({ message: "User not found" });
      }

      let { name, description, brandId, categoryId, variants, slug } = req.body;

      if (!name || !brandId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Name, Brand, and Category are required" });
      }

      if (typeof variants === "string") {
        variants = JSON.parse(variants);
      }

      const newProduct = new Product({
        userId,
        name,
        description,
        brandId,
        categoryId,
        slug,
      });
      const savedProduct = await newProduct.save();

      for (const variant of variants) {
        const newVariant = new Variant({
          ...variant,
          productId: savedProduct._id,
          image: variant.image,
        });
        await newVariant.save();
      }

      res.status(201).json({
        message: "Product created successfully",
        product: {
          userId: savedProduct.userId,
          productId: savedProduct._id,
          name: savedProduct.name,
          description: savedProduct.description,
          brandId: savedProduct.brandId,
          categoryId: savedProduct.categoryId,
          slug: savedProduct.slug,
          variants,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new ProductController();
