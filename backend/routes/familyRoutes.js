// All API endpoints will remain here


// Import the Express library
import express from "express";

// Create a new router object from Express
// This router will hold all the routes for "family members"
const router = express.Router();

//import { upload } from "../middleware/multer.cloudinary.js";
// import path from 'path';     // for resolving file paths.
import multer from "multer";

//middleware that verifys the user to acess protected routes
import fetchUser from "../middleware/fetchUser.js";

import User from "../model/user.js";


// Import all controller functions from 'familyController.js'
// These functions contain the logic for handling each API request
import { addMember, getMembers, getMemberById, updateMember, deleteMember } from '../controllers/familyController.js';


// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// import bodyParser from "body-parser"; // Missing in your snippet, but used later
// router.use(express.static(path.resolve(__dirname,'public/uploads')));


// Store files in memory (buffer) instead of disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


//API endpoints/ routes

// Define a POST route for '/' (root of this router)
// When a POST request is made to '/', the addMember controller runs
router.post("/", upload.single("photo"), addMember);     // These are relative to /api/family (from app.js), for file upload version

router.get('/', fetchUser, getMembers);   

router.get("/:id", getMemberById);

router.put("/:id", upload.single("photo"), updateMember);

router.delete('/:id', deleteMember);



//protected route-- only logged in user can access it
router.get('/', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")    //remove password
    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching family data:", err)
    res.status(500).json({ success: false, message: "Server error" });
  }
})


export default router;