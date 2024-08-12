// api/moveOrders.js
const mongoose = require('mongoose');
const placedOrdersModel = require('../../model/placedOrderModel');
const deliveredOrdersModel = require('../../models/deliveredOrdersModel');
const dbConnect = require('../../config/dbConnect');

export default async function handler(req, res) {
    // Make db connection
    await dbConnect();

    // Calculate the date 3 days ago from now
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    try {
        // Find orders that were placed exactly 3 days ago
        const ordersToMove = await placedOrdersModel.find({ orderPlacedAt: { $lte: threeDaysAgo } });

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
