const Product = require('../models/Products');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await Product.find().populate('brandId', 'name').populate('categoryId', 'name');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
}
module.exports = new ProductController();
