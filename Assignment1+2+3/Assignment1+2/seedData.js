
const bcrypt = require('bcryptjs');
const { connectDB, Category, Product, mongoose } = require('./config/database');
const Account = require('./models/account');
async function seedDatabase() {
    await connectDB();

    const accounts = [
        {
            username: 'admin',
            password: '123456',
        }
    ];

    await Account.insertMany(accounts);
    console.log('Thêm data mẫu cho Account thành công!');

    const categories = [
        { name: 'Điện thoại', description: 'Điện thoại' },
        { name: 'Laptop', description: 'Laptop' },
        { name: 'Tai nghe', description: 'Tai nghe' },
        { name: 'Phụ kiện', description: 'Phụ kiện' },
    ];

    await Category.insertMany(categories);
    console.log('Thêm data mẫu cho Category thành công!');

    const products = [
        {
            name: 'iPhone 14 Pro Max',
            description: 'Điện thoại thông minh cao cấp',
            price: 30000000,
            categoryId: (await Category.findOne({ name: 'Điện thoại' }))._id,
        },
        {
            name: 'Samsung Galaxy S23 Ultra',
            description: 'Điện thoại thông minh cao cấp',
            price: 25000000,
            categoryId: (await Category.findOne({ name: 'Điện thoại' }))._id,
        },
        {
            name: 'MacBook Pro 16 inch',
            description: 'Laptop hiệu năng cao',
            price: 50000000,
            categoryId: (await Category.findOne({ name: 'Laptop' }))._id,
        },
        {
            name: 'AirPods Pro',
            description: 'Tai nghe không dây chống ồn',
            price: 5000000,
            categoryId: (await Category.findOne({ name: 'Tai nghe' }))._id,
        },
        {
            name: 'Cáp sạc USB-C',
            description: 'Phụ kiện sạc nhanh',
            price: 200000,
            categoryId: (await Category.findOne({ name: 'Phụ kiện' }))._id,
        },
    ];

    await Product.insertMany(products);
    console.log('Thêm data mẫu cho Product thành công!');

    process.exit();
}

seedDatabase();