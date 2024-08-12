const mongoose = require('mongoose');

const placedOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    contact_number: { type: String, required: true },
    orderPlacedAt: { type: Date, default: Date.now }, // This field will store the date and time of order placement
});

const placedOrderModel = mongoose.model('placedOrder', placedOrderSchema);

module.exports = placedOrderModel;
