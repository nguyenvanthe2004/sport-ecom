const Variant = require('../models/Variants');

class VariantController {
    async getAllVariants(req, res) {
        try {
            const variants = await Variant.find().populate('productId', 'name').populate('sizeId', 'size').populate('colorId', 'color');
            res.status(200).json(variants);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new VariantController();
