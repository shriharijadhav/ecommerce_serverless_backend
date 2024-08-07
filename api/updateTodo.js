const todoModel = require('../model/todoModel');
const dbConnect = require('../config/dbConnect');

export default async function handler(req, res) {
    await dbConnect();

    try {
        const updatedTodo = req.body;
        const id = updatedTodo._id;
        
        const dataToUpdate = {todoName:updatedTodo.todoName,assigneeName:updatedTodo.assigneeName,priority:updatedTodo.priority}
        const response = await todoModel.findByIdAndUpdate(id,dataToUpdate,{new:true});
        
        if(response){
            return res.status(200).json({
                message:"Todo updated successfully",
                todoUpdated:true,
            })
        }

        return res.status(200).json({
            message:"Failed to update todo",
            todoUpdated:false,
        })


    } catch (error) {
        return res.status(500).json({
            error: 'Failed to update todos'
        });
    }
}
