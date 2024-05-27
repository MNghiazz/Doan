const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');

router.get(`/`, async (req, res) => {
    const orderList = await OrderItem.find();//find all of the product

    if(!orderList){
        res.status(500).json({success: false})
    }
    res.send(orderList);
});

router.get(`/:id`, async (req, res) => {     //find 1 order by id
    const order = await OrderItem.findById(req.params.id);

    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
});

router.get(`/get/count`, async (req, res) => {
    try {
        const orderCount = await Order.countDocuments({});     //count product

        if(!orderCount){
            res.status(500).json({success: false})
        }
        res.send({
            orderCount: orderCount,
        });
    }catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
    
})

router.post(`/`, async (req, res) => {      //create category
    let orderItems = new OrderItem({
        product: req.body.product
    });

    orderItems = await orderItems.save();
    if(!orderItems) {
        return res.status(404).send('the category cannot be created');
    }
    
    res.send(orderItems);
})

router.put('/:id', async (req, res) => {        //Update category
    try {
        const { id } = req.params;
        const { status } = req.body;

        const orderItem = await OrderItem.findByIdAndUpdate(id, { status }, { new: true });

        if (!orderItem) return res.status(404).send('Order item not found.');

        res.send(orderItem);
    } catch (error) {
        res.status(500).send('Server error');
    }
})

router.delete('/:id', (req, res) => {
    OrderItem.findByIdAndDelete(req.params.id).then(orderItems => {            //delete a category by id
        if(orderItems) {
            return res.status(200).json({success: true, message: 'the item has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'item not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})

module.exports = router;