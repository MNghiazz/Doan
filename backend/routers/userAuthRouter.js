const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authJwt = require('../helpers/jwt');

// Route to get userId from token
router.get('/user', authJwt, (req, res) => {
    // Extract userId from decoded JWT payload
    const userId = req.user.userId;

    // Respond with userId
    res.status(200).json({ userId });
});

module.exports = router;
