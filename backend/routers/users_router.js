const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');


router.get(`/`, async (req, res) => {
    const productList = await User.find().select('-passwordHash');     //find all of the product

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
})

router.get('/:id', async (req, res) => {            //find category with id
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if(!user) {
        res.status(500).json({message: 'the user with the id given was not found'});
    }
    res.status(200).send(user); 
})


router.post(`/`, async (req, res) => {      //create category
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

router.post(`/register`, async (req, res) => {      //create category
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
    User.findByIdAndDelete(req.params.id).then(user => {            //delete a category by id
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