const mongoose = require('mongoose');

async function dbConnect() {
    mongoose.connect("mongodb+srv://admin:admin123@cluster0.8jmykz6.mongodb.net/ecommerce")
    .then(()=>{
        console.log('DB connection succeeded')
    })
    .catch(()=>{
        console.log('DB connection failed')
    })
}

module.exports = dbConnect