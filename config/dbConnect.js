const mongoose = require('mongoose');

async function dbConnect() {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log('DB connection succeeded')
    })
    .catch(()=>{
        console.log('DB connection failed')
    })
}

module.exports = dbConnect