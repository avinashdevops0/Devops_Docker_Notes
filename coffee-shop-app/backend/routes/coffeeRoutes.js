const express = require('express');
const router = express.Router();
const coffeeController = require('../controllers/coffeeController');

// Get all coffee items
router.get('/coffee', coffeeController.getCoffeeItems);

// Create new order
router.post('/orders', coffeeController.createOrder);

// Get all orders
router.get('/orders', coffeeController.getOrders);

module.exports = router;