import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { body, validationResult } from "express-validator"
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

//route to login user
router.post(
  "/loginuser",
  [
    body('email').isEmail(),
    body("password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

  try {    
    console.log("Searching for user:", email)
    const userData = await User.findOne({ email });
    console.log("User found:", userData)

    if (!userData) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    //compare provided pw with hashed password in db
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // for authtoken after login
    const payload = {
      user: {
        id: userData._id,
      },
    }

    const authToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h"})

    //successful login
    res.json({ success: true, authToken, message: "Logged in Successfully" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
