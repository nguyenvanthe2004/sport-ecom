const Brand = require("../models/Brands");

class BrandController {
  async getAllBrands(req, res) {
    try {
      const brands = await Brand.find().populate("userId", "fullname");
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async createBrand(req, res) {
    try {
      const { userId, name, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Brand name is required" });
      }
      const existingBrand = await Brand.find({ name });
      if (existingBrand.length > 0) {
        return res.status(400).json({ message: "Brand name already exists" });
      }
      const newBrand = new Brand({
        userId,
        name,
        description,
      });

      const savedBrand = await newBrand.save();
      res.status(201).json({
        message: "Brand created successfully",
        brand: {
          userId: savedBrand.userId,
          brandId: savedBrand._id,
          name: savedBrand.name,
          description: savedBrand.description,
          createAt: savedBrand.createAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateBrand(req, res) {
    try {
      const { brandId } = req.params;
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Brand name is required" });
      }
      const existingBrand = await Brand.find({ name, _id: { $ne: brandId } });
      if (existingBrand.length > 0) {
        return res.status(400).json({ message: "Brand name already exists" });
      }
      const updatedBrand = await Brand.findByIdAndUpdate(
        brandId,
        { name, description },
        { new: true }
      );
      if (!updatedBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({
        message: "Brand updated successfully",
        brand: {
          brandId: updatedBrand._id,
          name: updatedBrand.name,
          description: updatedBrand.description,
          createAt: updatedBrand.createAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteBrand(req, res) {
    try {
      const { brandId } = req.params;
      const deleteBrand = await Brand.findByIdAndDelete(brandId);
      if (!deleteBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new BrandController();
