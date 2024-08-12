const mongoose = require('mongoose');

const deliveredOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    contact_number: { type: String, required: true },
    orderPlacedAt: { type: Date, required: true }, // Keeping the original placed order time
    deliveredAt: { type: Date, default: Date.now } // Automatically set when the order is moved to this collection
});

const DeliveredOrder = mongoose.model('DeliveredOrder', deliveredOrderSchema);

module.exports = DeliveredOrder;
