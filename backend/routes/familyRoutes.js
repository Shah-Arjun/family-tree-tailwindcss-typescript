// All API endpoints will remain here


// Import the Express library
import express from "express";

// Create a new router object from Express
// This router will hold all the routes for "family members"
const router = express.Router();


// Import all controller functions from 'familyController.js'
// These functions contain the logic for handling each API request
import { addMember, getMembers, getMemberById, updateMember, deleteMember } from '../controllers/familyController.js';

//for photo
import multer from "multer";

//configure multer
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads/"); //save files in backend/uploads
    },
});
const upload = multer({storage})


//API endpoints/ routes

// Define a POST route for '/' (root of this router)
// When a POST request is made to '/', the addMember controller runs
router.post("/", upload.single("photo"), addMember);     // These are relative to /api/family (from app.js), for file upload version

router.get('/', getMembers);

router.get("/:id", getMemberById);

router.put("/:id", upload.single("photo"), updateMember);

router.delete('/:id', deleteMember);





export default router;