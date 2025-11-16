const userRoutes = require('./user');
const brandRoutes = require('./brand');
const categoryRoutes = require('./category');
const productRoutes = require('./product');
const variantRoutes = require('./variant');
const orderRoutes = require('./order');
const cartRoutes = require('./cart');
const cartitemRoutes = require('./cartitem');
const paymentRoutes = require('./payment');
const uploadRoutes = require('./upload');
const dashboardRoutes = require('./dashboard');

function route(app) {
    app.use('/user', userRoutes);

    app.use('/brand', brandRoutes);

    app.use('/category', categoryRoutes);

    app.use('/product', productRoutes);

    app.use('/variant', variantRoutes);

    app.use('/order', orderRoutes);

    app.use('/cart', cartRoutes);

    app.use('/cartitem', cartitemRoutes);
    
    app.use('/payment', paymentRoutes);

    app.use('/upload', uploadRoutes);

    app.use('/dashboard', dashboardRoutes);
}
module.exports = route;