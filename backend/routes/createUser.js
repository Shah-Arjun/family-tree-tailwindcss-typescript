import express from 'express'
import User from '../model/user.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import { body, validationResult } from "express-validator"

dotenv.config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

// route to create a new user
router.post(
    "/createuser",
    [
        body("email").isEmail(),
        body("name").isLength({ min: 5 }),
        body("password").isLength({ min: 5 }),   
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            //store new user create data from frontend
            const user = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            //stores user in db
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                password: hashedPassword,
            });

            //return token after signup
            const payload = { user: {id: newUser._id} }
            const authToken = jwt.sign(payload, jwtSecret, { expiresIn: "5h"});

            res.json({ success: true, authToken, message: "User created" });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false });
        }
    }
);


export default router