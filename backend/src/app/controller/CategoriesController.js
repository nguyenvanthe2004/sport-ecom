const Category = require("../models/Categories");

class CategoriesController {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async createCategory(req, res) {
    try {
      const { userId, name, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }
      const existingCategory = await Category.find({ name });
      if (existingCategory.length > 0) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }
      const newCategory = new Category({
        userId,
        name,
        description,
      });

      const savedCategory = await newCategory.save();
      res.status(201).json({
        message: "Category created successfully",
        category: {
          userId: savedCategory.userId,
          categoryId: savedCategory._id,
          name: savedCategory.name,
          description: savedCategory.description,
          createAt: savedCategory.createAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }
      const existingCategory = await Category.find({
        name,
        _id: { $ne: categoryId },
      });
      if (existingCategory.length > 0) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({
        message: "Category updated successfully",
        category: {
          categoryId: updatedCategory._id,
          name: updatedCategory.name,
          description: updatedCategory.description,
          createAt: updatedCategory.createAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const deleteCategory = await Category.findByIdAndDelete(categoryId);
      if (!deleteCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new CategoriesController();
