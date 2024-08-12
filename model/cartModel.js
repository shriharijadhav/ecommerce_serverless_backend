const mongoose = require('mongoose')
 
const cartSchema = mongoose.Schema({
    allProductsInCart:{
        type:Array,
        default:[],
    },
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})

const cartModel = mongoose.model('cart', cartSchema)

module.exports = cartModel


