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
        .populate({
          path: "variants",
          select: "nameDetail price stock image",
        })
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        page,
        limit,
        totalPages,
        totalProducts,
        products,
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      res.status(500).json({ message: error.message });
    }
  }
  async searchProducts(req, res) {
    try {
      const { q, categoryId, brandId, minPrice, maxPrice } = req.query;

      if (!q && !categoryId && !brandId && !minPrice && !maxPrice) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập từ khóa hoặc bộ lọc" });
      }

      const productFilter = {};

      if (categoryId) productFilter.categoryId = categoryId;

      if (brandId) productFilter.brandId = brandId;

      if (q) {
        productFilter.name = { $regex: q, $options: "i" };
      }

      let products = await Product.find(productFilter)
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .populate({
          path: "variants",
          select: "nameDetail price stock image",
        })
        .sort({ createAt: -1 })
        .lean();
      if (products.length === 0 && q) {
        const variantMatches = await Variant.find({
          nameDetail: { $regex: q, $options: "i" },
        }).lean();

        if (variantMatches.length > 0) {
          const productIds = variantMatches.map((v) => v.productId);
          products = await Product.find({ _id: { $in: productIds } })
            .populate("brandId", "name")
            .populate("categoryId", "name")
            .populate({
              path: "variants",
              select: "nameDetail price stock image",
            })
            .sort({ createAt: -1 })
            .lean();
        }
      }
      if (minPrice || maxPrice) {
        products = products.filter((p) => {
          const matchedVariants = p.variants.filter((v) => {
            if (minPrice && v.price < minPrice) return false;
            if (maxPrice && v.price > maxPrice) return false;
            return true;
          });
          return matchedVariants.length > 0;
        });
      }

      res.status(200).json({
        success: true,
        total: products.length,
        products,
      });
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm sản phẩm:", error);
      res.status(500).json({ message: "Lỗi server khi tìm kiếm sản phẩm" });
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const { categoryId, brandId, minPrice, maxPrice } = req.query;

      const filter = {};

      if (categoryId) filter.categoryId = categoryId;

      if (brandId) filter.brandId = brandId;

      const products = await Product.find(filter)
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .populate({
          path: "variants",
          select: "nameDetail price stock image",
        })
        .lean();

      let filteredProducts = products;
      if (minPrice || maxPrice) {
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;

        filteredProducts = products.filter((product) => {
          const validVariants = product.variants.filter(
            (v) => v.price >= min && v.price <= max
          );
          return validVariants.length > 0;
        });
      }

      return res.status(200).json({
        success: true,
        total: filteredProducts.length,
        products: filteredProducts,
      });
    } catch (error) {
      console.error("❌ Lỗi khi lọc sản phẩm:", error);
      res.status(500).json({ message: "Lỗi server khi lọc sản phẩm" });
    }
  }
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({ slug })
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .lean();

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      const variants = await Variant.find({ productId: product._id }).lean();

      product.variants = variants;

      const relatedProducts = await Product.find({
        categoryId: product.categoryId?._id,
        _id: { $ne: product._id },
      })
        .limit(6)
        .populate("categoryId", "name")
        .lean();

      const relatedIds = relatedProducts.map((p) => p._id);
      const relatedVariants = await Variant.find({
        productId: { $in: relatedIds },
      }).lean();

      const relatedWithVariants = relatedProducts.map((p) => ({
        ...p,
        variants: relatedVariants.filter(
          (v) => v.productId.toString() === p._id.toString()
        ),
      }));

      res.status(200).json({
        product,
        relatedProducts: relatedWithVariants,
      });
    } catch (error) {
      console.error("❌ Lỗi khi lấy sản phẩm theo slug:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  async createProduct(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res.status(400).json({ message: "User not found" });
      }

      let { name, description, brandId, categoryId, variants } = req.body;

      console.log(req.body);

      if (!name || !brandId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Name, Brand, and Category are required" });
      }

      // Tạo slug tự động, đảm bảo unique bằng timestamp
      const slug =
        req.body.slug || slugify(name, { lower: true, strict: true });
      const newProduct = new Product({
        userId,
        name,
        description,
        brandId,
        categoryId,
        slug,
      });

      const savedProduct = await newProduct.save();

      if (typeof variants === "string") variants = JSON.parse(variants);
      variants = variants || [];

      for (const variant of variants) {
        const newVariant = new Variant({
          ...variant,
          productId: savedProduct._id,
        });
        const savedVariant = await newVariant.save();

        await Product.findByIdAndUpdate(savedProduct._id, {
          $push: { variants: savedVariant._id },
        });
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
      let { name, description, brandId, categoryId, variants, slug } = req.body;

      if (!name || !brandId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Name, Brand, and Category are required" });
      }

      // Sinh slug tự động nếu không có
      slug =
        slug || slugify(name, { lower: true, strict: true }) + "-" + Date.now();

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, brandId, categoryId, slug },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Xử lý variants
      if (typeof variants === "string") variants = JSON.parse(variants);
      variants = variants || [];

      // Cập nhật hoặc thêm mới
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
          await Product.findByIdAndUpdate(savedProduct._id, {
            $push: { variants: savedVariant._id },
          });
        }
      }

      // Xóa các variant bị loại bỏ
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
        },
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
        message: "Product and its variants deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
