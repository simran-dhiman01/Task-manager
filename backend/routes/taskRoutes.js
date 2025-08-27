import express from 'express'
import { addTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/taskController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
const router = express.Router();


router.get('/', isAuthenticated , getTasks)
router.get('/:id', isAuthenticated , getTaskById)
router.post('/add', isAuthenticated , addTask)
router.put('/update/:id', isAuthenticated , updateTask)
router.delete('/delete/:id', isAuthenticated , deleteTask)

export default router;