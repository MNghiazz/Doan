const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');




// Middleware function to extract userId from JWT token
function extractUserId(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.secret);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

router.get('/profile', extractUserId, async (req, res) => {
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    // Perform operations using the userId
    res.json({ userId, isAdmin });
});

// Example route that uses the middleware to extract userId
router.get('/account', extractUserId, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select('name email phone'); // Chọn các trường cần lấy
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');
        if (!userList) {
            return res.status(500).json({ success: false });
        }
        res.send(userList);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

router.get('/:id', async (req, res) => {            //find user by id
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: 'the user with the id given was not found' });
    }
    res.status(200).send(user);
})


router.post(`/register`, async (req, res) => {      //create user
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin
    });

    user = await user.save();
    if (!user) {
        return res.status(404).send('the user cannot be created');
    }

    res.send(user);
})



router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send('The user is not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1w' }               // a secret line to prevent decode ?
        );

        res.status(200).send({ user: user.email, token: token })
    } else {
        res.status(400).send('password is wrong')
    }

})


router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await User.countDocuments({});

        if (userCount === 0) {
            return res.status(500).json({ success: false });
        }

        res.send({
            userCount: userCount
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {            //delete a user by id
        if (user) {
            return res.status(200).json({ success: true, message: 'the user has been deleted' });
        }
        else {
            return res.status(404).json({ success: false, message: 'user not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    })
})

router.put('/update-profile', extractUserId, async (req, res) => {
    const userId = req.userId;
    const { name, email, phone } = req.body;

    const updateFields = {
        name: name,
        email: email,
        phone: phone,
    };
    
    try {
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!user) {
            return res.status(404).send('Không thể cập nhật thông tin người dùng');
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;