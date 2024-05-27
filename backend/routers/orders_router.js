const express = require('express');
const router = express.Router();
const {Order} = require('../models/order');
const { OrderItem } = require('../models/order-item');

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name phone' );     //find all of the product

    if(!orderList){
        res.status(500).json({success: false})
    }
    res.send(orderList);
});

router.get(`/:id`, async (req, res) => {     //find 1 order by id
    const order = await Order.findById(req.params.id)
    .populate('user', 'name phone').populate({path: 'orderItems', populate:'product'});     

    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId }).populate('orderItems');
        if (!orders) {
            return res.status(404).json({ message: 'Orders not found' });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemsIds;
    
    let order = new Order({ 
        orderItems: orderItemsIdsResolved,
        user: req.body.user,
    });

    order = await order.save();   

    if(!order) {
        return res.status(404).send('the order cannot be created');
    }
    
    res.send(order);
})

router.put('/:id', async (req, res) => {        //Update order
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            orderItems: req.body.orderItems
        },
        { new: true}
    )
    if(!order) {
        return res.status(404).send('the status cannot be updated');
    }
    
    res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then( async order => {            //delete a category by id
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'order not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})


module.exports = router;