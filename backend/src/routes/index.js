const userRoutes = require('./user');
const brandRoutes = require('./brand');
const categoryRoutes = require('./category');
const productRoutes = require('./product');
const variantRoutes = require('./variant');
const orderRoutes = require('./order');
const cartRoutes = require('./cart');
const paymentRoutes = require('./payment');

function route(app) {
    app.use('/user', userRoutes);

    app.use('/brand', brandRoutes);

    app.use('/category', categoryRoutes);

    app.use('/product', productRoutes);

    app.use('/variant', variantRoutes);

    app.use('/order', orderRoutes);

    app.use('/cart', cartRoutes);
    
    app.use('/payment', paymentRoutes);
}
module.exports = route;