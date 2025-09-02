import { Task } from "../models/taskModel.js";


//GET ALL TASKS
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error : Failed to load tasks',
            success: false
        })
    }
}

//GET TASK BY ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }
        res.status(200).json({
            success: true,
            task
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error : Failed to load task',
            success: false
        })
    }
}

//ADD NEW TASK
export const addTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                error: 'Title is required and must be a non-empty string',
                success: false
            });
        }
        if (!dueDate || isNaN(Date.parse(dueDate))) {
            return res.status(400).json({ error: 'Valid due date is required (YYYY-MM-DD)' });
        }

        const task = new Task({
            title,
            dueDate,
            priority,
            description,
            completed: completed || false,
            owner: req.user.id
        })
        const newTask = await task.save()

        res.status(201).json({
            success: true,
            task: newTask,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error : Please try again later',
            success: false
        })
    }
}

//UPDATE TASK status
export const updateTask = async (req, res) => {
    try {
        const taskID = req.params.id
        const data = { ...req.body }
        const updated = await Task.findOneAndUpdate(
            { _id: taskID, owner: req.user.id },
            data,
            { new: true, runValidators: true }
        )
        if (!updated) {
            return res.status(400).json({ success: false, message: "Task not found or not yours." })
        }
        res.status(200).json({
            success: true,
            updated,
            message: "Task updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error : Please try again later',
            success: false
        })
    }
}

//DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const taskID = req.params.id
        const deleteTask = await Task.findOneAndDelete(
            { _id: taskID, owner: req.user.id }
        )
        if (!deleteTask) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }
        res.status(200).json({ success: true, message: "Task deleted." })
    } catch (error) {
        res.status(500).json({
            message: 'Server error : Please try again later',
            success: false
        })
    }
}