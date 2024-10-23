const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');

const dbURI = 'mongodb://127.0.0.1:27017/Assignment1';

async function connectDB() {
    try {
        await mongoose.connect(dbURI);
        console.log('Kết nối đến MongoDB thành công!');
    } catch (err) {
        console.error('Lỗi kết nối đến MongoDB: ', err);
    }
}

module.exports = { connectDB, mongoose, Category, Product };
