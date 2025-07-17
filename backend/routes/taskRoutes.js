const express = require('express');
const router = express.Router();
const fs = require('fs').promises
const path = require('path');
const filePath = path.join(__dirname, '../tasks.json');

//READ FILE HELPER
const readTasks = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data.trim() === '' ? [] : JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return []
        throw error
    }
}

//WRITE FILE HELPER
const writeFile = async (tasks) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        throw error
    }
}

//VIEW ALL TASK
router.get('/', async (req, res) => {
    try {
        const data = await readTasks();
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.log(error);
        res.status(500).json('Server error : Failed to read tasks')

    }
})


//ADD NEW TASK
router.post('/', async (req, res) => {
    try {
        const { title, duedate, status } = req.body
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                error: 'Title is required and must be a non-empty string',
                success: false
            });
        }
        if (!duedate || isNaN(Date.parse(duedate))) {
            return res.status(400).json({ error: 'Valid due date is required (YYYY-MM-DD)' });
        }
        const allowedStatus = ['pending', 'completed']
        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
        }
        //to get the existing tasks , read tasks first
        const tasks = await readTasks()
        const newTask = {
            id: Date.now(),
            title,
            duedate,
            status: status || 'Pending'
        }
        //push the task to the exisitng array of tasks
        tasks.push(newTask);
        await writeFile(tasks)
        res.status(201).json({
            newTask,
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json('Server error : Please try again later')
    }
})

//UPDATE TASK STATUS
router.put('/:id', async (req, res) => {
    try {
        const taskID = req.params.id
        const { status } = req.body;
        const allowedStatus = ['pending', 'completed']
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
        }
        const tasks = await readTasks();
        let found = false
        const updatedTask = tasks.map(task => {
            if (task.id === Number(taskID)) {
                found = true;
                return { ...task, status };
            }
            return task;
        })
        if (!found) {
            return res.status(404).json({ error: 'Task not found', success: false });
        }

        await writeFile(updatedTask)
        res.json({ message: 'Task status updated', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json('Server error : Failed to update task status')
    }

})

//DELETE TASK
router.delete('/:id', async (req, res) => {
    try {
        const taskID = req.params.id
        const tasks = await readTasks();
        const remainingTasks = tasks.filter(task => task.id !== Number(taskID))

        if (remainingTasks.length === tasks.length) {
            return res.status(404).json({ error: 'Task not found', success: false });
        }

        await writeFile(remainingTasks);
        res.json({ message: 'Task deleted successfully', success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json('Server error : Please try again later')
    }
})

module.exports = router;