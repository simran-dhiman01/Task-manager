import express from 'express'
import { register,login,logout,updatePassword,updateProfile,getCurrentUser } from "../controllers/userController.js";
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();
router.post('/register' , register);
router.post('/login' ,login);
router.post('/logout', isAuthenticated, logout);
router.put('/updatePassword' ,isAuthenticated, updatePassword);
router.put('/updateProfile',isAuthenticated, updateProfile);
router.get('/me',isAuthenticated, getCurrentUser)

export default router;