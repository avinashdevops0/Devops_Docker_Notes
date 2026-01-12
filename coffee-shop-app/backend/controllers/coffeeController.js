const Coffee = require('../models/Coffee');

exports.getCoffeeItems = async (req, res) => {
    try {
        const items = await Coffee.getAll();
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error fetching coffee items:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching coffee items'
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_name, email, items, total_amount } = req.body;
        
        if (!customer_name || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        const orderId = await Coffee.create({
            customer_name,
            email,
            total_amount
        });
        
        await Coffee.createOrderItems(orderId, items);
        
        res.json({
            success: true,
            message: 'Order created successfully',
            orderId
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Coffee.getAllOrders();
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};