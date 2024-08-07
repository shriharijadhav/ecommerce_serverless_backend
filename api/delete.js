// const connectToDatabase = require('../dbConnect');
// const Todo = require('../models/Todo'); // Adjust the path as per your model location

export default function handler(request, response)  {
//   await connectToDatabase();

  const { id } = req.query;

  try {
    // await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
