const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const s3 = require('../helpers/s3'); // Ensure you have configured s3.js as described earlier

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        const categoryId = req.query.categories;
        filter = { category: { $in: [categoryId] } }; // Wrap categoryId in an array for $in operator
    }

    if (req.query.authors) {
        const authorId = req.query.authors;
        filter.author = authorId;
    }

    try {
        const productList = await Product.find(filter).populate('author category');
        res.send(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const recentProducts = await Product.find().sort({ dateCreated: -1 }).limit(20).populate('author category');
        res.send(recentProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category author');

    if (!product) {
        res.status(500).json({ message: 'The product with the given ID was not found' });
    }
    res.status(200).send(product);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews
        },
        { new: true }
    );

    if (!product) {
        return res.status(404).send('The product cannot be updated');
    }

    res.send(product);
});

router.post('/', upload.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.originalname.split(' ').join('-');
    const extension = file.mimetype.split('/')[1];
    const s3Key = `${fileName}-${Date.now()}.${extension}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        const imageUrl = uploadResult.Location;

        let product = new Product({
            name: req.body.name,
            image: imageUrl,
            description: req.body.description,
            author: req.body.author,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send('The product cannot be created');
        }

        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating the product');
    }
});

router.put('/:id/image', upload.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }

    const file = req.file;
    if (!file) {
        return res.status(400).send('No image in the request');
    }

    const fileName = file.originalname.split(' ').join('-');
    const extension = file.mimetype.split('/')[1];
    const s3Key = `${fileName}-${Date.now()}.${extension}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        const imageUrl = uploadResult.Location;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { image: imageUrl },
            { new: true }
        );

        if (!product) {
            return res.status(404).send('The product cannot be updated');
        }

        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating the product image');
    }
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'The product has been deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    });
});

router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments({});

        if (!productCount) {
            res.status(500).json({ success: false });
        }
        res.send({
            productCount: productCount,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
