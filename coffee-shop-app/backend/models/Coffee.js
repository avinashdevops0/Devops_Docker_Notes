const db = require('../config/database');

class Coffee {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM coffee_items ORDER BY category, name');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM coffee_items WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(orderData) {
        const { customer_name, email, total_amount } = orderData;
        
        const [result] = await db.execute(
            'INSERT INTO orders (customer_name, email, total_amount) VALUES (?, ?, ?)',
            [customer_name, email, total_amount]
        );
        
        return result.insertId;
    }

    static async createOrderItems(orderId, items) {
        for (const item of items) {
            await db.execute(
                'INSERT INTO order_items (order_id, coffee_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.coffee_id, item.quantity, item.price]
            );
        }
    }

    static async getAllOrders() {
        const [rows] = await db.execute(`
            SELECT o.*, 
                   GROUP_CONCAT(CONCAT(oi.quantity, 'x ', ci.name) SEPARATOR ', ') as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN coffee_items ci ON oi.coffee_id = ci.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        return rows;
    }
}

module.exports = Coffee;