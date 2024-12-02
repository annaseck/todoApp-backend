import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Todo from "../models/todo.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
    let { name, email, password, age } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: "User already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            name,
            email,
            password: hashedPassword,
            age
        });
        await user.save();

        const payload = {
            user : user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        });

        res.cookie("token", token, {
            httpOnly: true,
            expiresIn: 360000
        });

        const { password: pass, ...rest} = user._doc;

        res.status(201).json({message: "User registered successfully", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const payload = {
            user : user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        });

        res.cookie("token", token, {
            httpOnly: true,
            expiresIn: 360000
        });

        const { password: pass, ...rest} = user._doc;

        res.status(201).json({message: "User logged in successfully", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "User logged out successfully"});
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const { password: pass, ...rest} = user._doc;
        return res.status(200).json({message: "User found", user: rest});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const updateDetails = async (req, res) => {
    const { name, email, age } = req.body;
    try {
        let user = await User.findById(req.user);
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        let exists = await User.findOne({email});
        if(exists && exists._id.toString() !== user._id.toString()){
            return res.status(404).json({message: "Email already exists"});
        }
        
            user.name = name;
            user.email = email;
            user.age = age;

        await user.save();

        const { password: pass, ...rest} = user._doc;

        return res.status(200).json({message: "User updated successfully", user: rest});

    } catch (error) {

        
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const updatePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    try {
        let user = await User.findById(req.user);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        const { password: pass, ...rest} = user._doc;

        return res.status(200).json({message: "Password updated successfully", user: rest});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        let user = await User.findById(req.user);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const todo = await Todo.find({user: req.user});
        if(todo){
            await Todo.deleteMany({user: req.user.user});
        }
        res.clearCookie("token");
        await user.deleteOne();
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

