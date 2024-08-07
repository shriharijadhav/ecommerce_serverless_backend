const todoModel = require('../model/todoModel');
const dbConnect = require('../config/dbConnect');

export default async function handler(req, res) {
    await dbConnect();

    try {
        

        return res.status(200).json({
            message:"test successful",
            todoUpdated:false,
        })


    } catch (error) {
        return res.status(500).json({
            error: 'Failed to update todos'
        });
    }
}
