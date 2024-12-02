import Todo from "../models/todo.js";

export const createTodo = async (req, res) => {
    const { title, description } = req.body;
    try {
        const todo = new Todo({
            title,
            description,
            completed: false,
            user: req.user
        });
        await todo.save();
        res.status(201).json({ success: true, todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user });
        res.status(200).json({ success: true, todos });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        if (todo.user.toString() !== req.user) {
            return res.status(401).json({ success: false, error: "Unauthorize" });
        }
        res.status(200).json({ success: true, todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        if (todo.user.toString() !== req.user) {
            return res.status(401).json({ success: false, error: "Unauthorize" });
        }
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        await todo.save();
        res.status(200).json({ success: true, todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
        
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        if (todo.user.toString() !== req.user) {
            return res.status(401).json({ success: false, error: "Unauthorize" });
        }
        await todo.deleteOne();
        res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};