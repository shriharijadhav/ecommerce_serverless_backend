const todoModel = require('../model/todoModel');
const dbConnect = require('../config/dbConnect');

export default async function handler(req, res) {
    await dbConnect();

    try {
       
    const {todoName, assigneeName, priority} = req.body

    const createdTodo = await todoModel.create({todoName:todoName, assigneeName:assigneeName, priority:priority})

    if(!createdTodo){
        return res.status(500).json({
            message:"Failed to create todo",
            todoCreationSuccess:false,

        })
    }

    return res.status(200).json({
        message:"New todo has been created successfully",
        todoCreationSuccess:true,
        createdTodo
    })
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch todos'
        });
    }
}
