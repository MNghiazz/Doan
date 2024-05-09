const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');
const mongoose = require('mongoose');
const {subCategory} = require('../models/subCategoroy');


router.get(`/`, async (req, res) => {
    const categoryList = await Category.find().populate('subcategories');     //find all of the category

    if(!categoryList){
        res.status(500).json({success: false})
    }
    res.send(categoryList);
})

router.get('/:id', async (req, res) => {            //find category with id
    const category = await Category.findById(req.params.id);
    
    if(!category) {
        res.status(500).json({message: 'the category with the id given was not found'});
    }
    res.status(200).send(category); 
})

router.post(`/`, async (req, res) => {      //create category
    let category = new Category({
        name: req.body.name
    });

    category = await category.save();
    if(!category) {
        return res.status(404).send('the category cannot be created');
    }
    
    res.send(category);
})

router.put('/:id', async (req, res) => {        //Update category
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name
        },
        { new: true}
    )
    if(!category) {
        return res.status(404).send('the category cannot be updated');
    }
    
    res.send(category);
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then(category => {            //delete a category by id
        if(category) {
            return res.status(200).json({success: true, message: 'the category has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'category not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})

module.exports = router;