const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors package
const Product = require('./models/productModel');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello NODE API!');
});

app.get('/blog', (req, res) => {
    res.send('Hello Blog');
});

// Reading data with get requests
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Find data with specific id
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Saving data to server
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Edit/update product data
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

mongoose.set("strictQuery", false) //disabling strict mode for testing purposes

//connect to mongodb database
mongoose.connect(`mongodb+srv://jasonameskit:mangotime@cluster0.su3t5ma.mongodb.net/Node-API?retryWrites=true&w=majority`)
.then(() => {
    //then start server
    app.listen(port, () => {
        console.log(`Node API app is running on port ${port}!`);
    });

    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log(error)
})

// mongodb uri: mongodb+srv://jasonameskit:mangotime@cluster0.su3t5ma.mongodb.net/?retryWrites=true&w=majority