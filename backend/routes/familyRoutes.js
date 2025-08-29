// All API endpoints will remain here


// Import the Express library
const express = require('express');

// Create a new router object from Express
// This router will hold all the routes for "family members"
const router = express.Router();


// Import all controller functions from 'familyController.js'
// These functions contain the logic for handling each API request
const { addMember, getMembers } = require('../controllers/familyController');


//API endpoints

// Define a POST route for '/' (root of this router)
// When a POST request is made to '/', the addMember controller runs
router.post('/', addMember);      // These are relative to /api/family (from app.js)

router.get("/", getMembers);





module.exports = router;