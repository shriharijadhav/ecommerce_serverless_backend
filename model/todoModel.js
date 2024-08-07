const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    todoName:{
        type:String,
    },
    assigneeName:{
        type:String
    },
    priority:{
        type:String
    },
})

const todoModel = mongoose.model('todo', todoSchema)

module.exports = todoModel