import jwt from 'jsonwebtoken';
import {User} from "../models/userModel.js";


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const verified = jwt.verify(token, process.env.JWTSECRET);
        const user = await User.findById(verified.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }
        if (!verified) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false,
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Token invalid or expired.'
        })
    }
}