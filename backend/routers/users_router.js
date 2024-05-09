const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {

            uploadError = null;
        }
        cb(uploadError, 'public/upload/user');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token is required' });

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.userId;
        next();
    });
};

// Route to get logged-in user's information
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');     //find all of the user

    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {            //find user by id
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if(!user) {
        res.status(500).json({message: 'the user with the id given was not found'});
    }
    res.status(200).send(user); 
})


router.post(`/`, async (req, res) => {      //create user
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin  
    });

    user = await user.save();
    if(!user) {
        return res.status(404).send('the user cannot be created');
    }
    
    res.send(user);
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
    if(!user) {
        return res.status(404).send('the user cannot be created');
    }
    
    res.send(user);
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    
    if(!user) {
        return res.status(400).send('The user is not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1w'}               // a secret line to prevent decode ?
        )
        
        res.status(200).send({user: user.email, token: token})
    }else {
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
        if(user) {
            return res.status(200).json({success: true, message: 'the user has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'user not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})


module.exports = router;