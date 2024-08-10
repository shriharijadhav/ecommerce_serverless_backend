const mongoose = require('mongoose');

const blacklistedTokenSchema = mongoose.Schema({
    accessToken:{
        type: String
    },
    refreshToken:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})

const blacklistedTokenModel = mongoose.model('blacklistedToken', blacklistedTokenSchema)

module.exports = blacklistedTokenModel
