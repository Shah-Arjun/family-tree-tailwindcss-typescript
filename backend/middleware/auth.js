// Middleware to authenticate requests using JWT.
// Checks for 'auth-token' in headers, verifies it with the secret key,
// and attaches the decoded user info to req.user. Blocks access if missing,
// invalid, or expired.

//middleware to verify the token

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();


// middleware to verify jwt requested from frontend
const verifyToken = (req, res, next) => {
    //get token from req header
    const token = req.header("auth-token");

    if(!token) {
        return res
            .status(401)
            .json({ success: false, message: "Access denied. NO token provided." });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        //verify token that if the token is signed using same secret
        const verified = jwt.verify(token, jwtSecret)

        req.user = verified.user      // attach user id to request
        next();                     // go to next middleware or route

    } catch (err) {
        console.error("JWT error:", err.message);
        return res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
};

export default verifyToken;