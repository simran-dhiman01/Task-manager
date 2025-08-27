import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWTSECRET, { expiresIn: '24h' });

//REGISTER NEW USER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are necessary.',
                success: false
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email.' })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be atleast 6 characters long.'
            })
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are necessary.',
                success: false
            })
        }
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(404).json({
                message: 'Invalid credentials',
                success: false,
            })
        }
        const comparedPassword = await bcrypt.compare(password, userExists.password);
        if (!comparedPassword) {
            return res.status(400).json({
                message: 'Invalid credentials',
                success: false,
            })
        }
        const token = generateToken(userExists._id);
        const user = {
            userId: userExists._id,
            name: userExists.name,
            email: userExists.email,
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', })
            .json({
                message: `Welcome back ${userExists.name}`,
                user,
                token,
                success: true
            })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        })
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Please enter valid email',
                success: false,
            })
        }
        //check if new email entered by the user already used in another account
        const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use by another account.'
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true, select: "name email" }
        )
        res.status(200).json({
            success: true,
            message: 'Profile updated',
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//UPDATE USER PASSWORD
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword} = req.body;
        if(!currentPassword || !newPassword || newPassword.length < 6){
             return res.status(400).json({
                message: 'Please enter valid password of atleast 6 characters.',
                success: false,
            })
        }
        const user = await User.findById(req.user.id).select('password');
        if(!user){
              return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password );
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid current password'
            })
        }
        user.password = await bcrypt.hash(newPassword,10);
        await user.save()
        res.json({
            success:true,
            message:'Password updated.'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}