const todoModel = require('../model/todoModel');
const dbConnect = require('../config/dbConnect');

export default async function handler(req, res) {
    await dbConnect();

    try {
       
        const {todoId} = req.body;
    // console.log(req.body)
    
    const response = await todoModel.findByIdAndDelete(todoId);
    if(response){
        return res.status(200).json({
            message:"Todo deleted successfully",
            todoDeletionSuccess:true,
        })
    }

    return res.status(200).json({
        message:"Failed to delete todo",
        todoDeletionSuccess:false,
    })
    
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch todos'
        });
    }
}
