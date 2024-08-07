const todoModel = require('../model/todoModel');
const dbConnect = require('../config/dbConnect');

export default async function handler(req, res) {
    await dbConnect();

     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
 

    try {
        const allTodos = await todoModel.find();
        return res.status(200).json({
            allTodos
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch todos'
        });
    }
}
