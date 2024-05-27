const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    let filter = {};

    // Tìm kiếm theo tên sách
    if (req.query.name) {
        const search = req.query.name;
        filter.name = { $regex: search, $options: "i" };  // Tìm kiếm theo tên sách, không phân biệt chữ hoa chữ thường
    }

    try {
        const productList = await Product.find(filter).populate('author category');
        res.status(200).send(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;