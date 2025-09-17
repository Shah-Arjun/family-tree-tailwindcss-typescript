import express from 'express'
import User from '../model/user.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { body, validationResult } from "express-validator"

dotenv.config();

const router = express.Router();

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
            await User.create({
                name: user.name,
                email: user.email,
                password: user.password,
            });

            //return token after signup
            const payload = { user: {id: user.id} }
            const authToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h"});

            res.json({ success: true });

        } catch (error) {
            console.error(error.meaasge);
            res.status(500).json({ success: false });
        }
    }
);
