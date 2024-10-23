const express = require('express');
const app = express();
const { connectDB } = require('./config/database');
const apiCategoryRouter = require('./routes/api/category');
const apiProductRouter = require('./routes/api/product');
const apiAuthRouter = require('./routes/api/auth');
const adminCategoryRouter = require('./routes/admin/category');
const adminProductRouter = require('./routes/admin/product');
const authRouter = require('./routes/auth');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

connectDB().then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(cookieParser());

    app.set('view engine', 'ejs');

    app.use(express.static('public'));

    app.use('/dashboard/auth', authRouter);

    app.use('/api/categories', apiCategoryRouter);
    app.use('/api/products', apiProductRouter);
    app.use('/api/auth', apiAuthRouter);

    app.use('/dashboard/categories', adminCategoryRouter);
    app.use('/dashboard/products', adminProductRouter);

    const port = 9999;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
});