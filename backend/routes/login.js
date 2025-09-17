import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../model/user.js";
import { body, validationResult } from "express-validator"
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router();

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
      return res.json({ success: false, error: "Invalid credentials" });
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
        id: userData.id,
      },
    }

    const authToken = JsonWebTokenError.sign(payload, jwtSecret, { expiresIn: "1h"})

    //successful login
    res.json({ success: true, authToken });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
