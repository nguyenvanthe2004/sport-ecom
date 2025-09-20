const Category = require('../models/Categories');

class CategoriesController {
    async getAllCategories(req, res) {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new CategoriesController();