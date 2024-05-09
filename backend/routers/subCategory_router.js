const express = require('express');
const router = express.Router();
const {subCategory} = require('../models/subCategoroy');
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
    const subCategoryList = await subCategory.find();     //find all of the category

    if(!subCategoryList){
        res.status(500).json({success: false})
    }
    res.send(subCategoryList);
})

router.post(`/`, async (req, res) => {      //create category
    let subcategory = new subCategory({
        name: req.body.name,
        belong: req.body.belong
    });

    subcategory = await subcategory.save();
    if(!subcategory) {
        return res.status(404).send('the category cannot be created');
    }
    
    res.send(subcategory);
})

router.delete('/:id', (req, res) => {
    subCategory.findByIdAndDelete(req.params.id).then(subcategory => {            //delete a category by id
        if(subcategory) {
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