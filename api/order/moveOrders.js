// api/moveOrders.js
const mongoose = require('mongoose');
const placedOrdersModel = require('../../model/placedOrderModel');
const deliveredOrdersModel = require('../../models/deliveredOrdersModel');
const dbConnect = require('../../config/dbConnect');

export default async function handler(req, res) {
    // Make db connection
    await dbConnect();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Calculate the date 5 minutes ago from now
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    try {
        // Find orders that were placed 5 minutes ago or earlier
        const ordersToMove = await placedOrdersModel.find({ orderPlacedAt: { $lte: fiveMinutesAgo } });

        if (ordersToMove.length > 0) {
            // Move each order to the deliveredOrders collection
            await Promise.all(
                ordersToMove.map(async (order) => {
                    const deliveredOrder = new deliveredOrdersModel(order.toObject());
                    await deliveredOrder.save();
                    await placedOrdersModel.deleteOne({ _id: order._id });
                })
            );

            return res.status(200).json({ message: 'Orders moved to deliveredOrders successfully.' });
        } else {
            return res.status(200).json({ message: 'No orders to move.' });
        }
    } catch (error) {
        console.error('Error moving orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
