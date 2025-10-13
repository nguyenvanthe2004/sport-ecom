const Product = require("../models/Products");
const Variant = require("../models/Variants");
const slugify = require("slugify");

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
      .limit(limit)
      .lean(); 

    const productIds = products.map((p) => p._id);
    const variants = await Variant.find({ productId: { $in: productIds } }).lean();

    const productsWithVariants = products.map((product) => ({
      ...product,
      variants: variants.filter((v) => v.productId.toString() === product._id.toString()),
    }));

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      page,
      limit,
      totalPages,
      totalProducts,
      products: productsWithVariants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


  async createProduct(req, res) {
    try {

      const userId = req.user.userId;

      if (!userId) {
        return res.status(400).json({ message: "User not found" });
      }

      let { name, description, brandId, categoryId, variants } = req.body;

      if (!name || !brandId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Name, Brand, and Category are required" });
      }

      const slug = slugify(name, { lower: true, strict: true });

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
  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const { name, description, brandId, categoryId, variants, slug } =
        req.body;

      if (!name || !brandId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Name, Brand, and Category are required" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, brandId, categoryId, slug },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (typeof variants === "string") {
        variants = JSON.parse(variants);
      }

      for (const variant of variants) {
        if (variant.id) {
          await Variant.findByIdAndUpdate(variant.id, {
            ...variant,
            image: variant.image, 
          });
        } else {
          const newVariant = new Variant({
            ...variant,
            productId: updatedProduct._id,
            image: variant.image, 
          });
          await newVariant.save();
        }
      }

      const ids = variants.filter((v) => v.id).map((v) => v.id);
      await Variant.deleteMany({ productId, _id: { $nin: ids } });

      res.status(200).json({
        message: "Product updated successfully",
        product: {
          userId: updatedProduct.userId,
          productId: updatedProduct._id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          brandId: updatedProduct.brandId,
          categoryId: updatedProduct.categoryId,
          slug: updatedProduct.slug,
          variants,
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      } 
      await Variant.deleteMany({ productId });

      res.status(200).json({
        message: "Product and its variants (and images) deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new ProductController();
