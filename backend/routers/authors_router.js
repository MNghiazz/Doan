const express = require('express');
const router = express.Router();
const {Author} = require('../models/author');
const mongoose = require('mongoose');



router.get(`/`, async (req, res) => {
    const authorList = await Author.find();     //find all of the author

    if(!authorList){
        res.status(500).json({success: false})
    }
    res.send(authorList);
})

router.get('/:id', async (req, res) => {            //find category with id
    const author = await Author.findById(req.params.id);
    
    if(!author) {
        res.status(500).json({message: 'the author with the id given was not found'});
    }
    res.status(200).send(author); 
})

router.post(`/`, async (req, res) => {      //create category
    let author = new Author({
        name: req.body.name
    });

    author = await author.save();
    if(!author) {
        return res.status(404).send('the author cannot be created');
    }
    
    res.send(author);
})

router.delete('/:id', (req, res) => {
    Author.findByIdAndDelete(req.params.id).then(author => {            //delete a category by id
        if(author) {
            return res.status(200).json({success: true, message: 'the author has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'author not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})

module.exports = router;