const mongoose = require('mongoose');

const useSchema = mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    contact:{
        type:String,
    }
    
})


const userModel = mongoose.model('user',useSchema);