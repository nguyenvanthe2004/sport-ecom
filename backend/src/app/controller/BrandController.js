const Brand = require('../models/Brands');

class BrandController {
    async getAllBrands(req, res) {
        try {
            const brands = await Brand.find().populate('userId', 'fullname');
            res.status(200).json(brands);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }   
    }
}
module.exports = new BrandController();