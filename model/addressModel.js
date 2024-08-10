const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false, // Indicates if this is the default address
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})

const addressModel = mongoose.model('address', addressSchema)

module.exports = addressModel


