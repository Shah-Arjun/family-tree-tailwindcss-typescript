import express from "express";
import bcrypt from 'bcrypt'
import User from "../model/user.js";

const router = express.Router()

router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // find user by email
    if (!user) {
      return res.json({ success: false, error: "Invalid credentials" });
    }

    //compare provided pw with hashed password in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    //successful login
    res.json({success: true, message: "Login successful", user: {email: user.email} });
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({success: false, message: "Server error" });
  }
});

export default router;