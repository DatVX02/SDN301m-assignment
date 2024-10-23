const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an instance of express
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/categoryProductDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
