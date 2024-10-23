const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

// Create the Express app
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/AssignmentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js API');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
