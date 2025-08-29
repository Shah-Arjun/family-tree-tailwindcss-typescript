//all API's logic based on familyMember model goes here

// importing model
const { error } = require('console');
const FamilyMember = require('../model/familyMember');

// API logic to add family member
exports.addMember = async (req, res) => {
    try {
        const member = new FamilyMember(req.body);  //frontend bata aako data member(document/ mongoDB object) banayr tesma ma rakh, req.body = the data sent from frontend (JSON form data)
        const saved = await member.save();                   // Save the new member to MongoDB
        res.status(200).json(saved)                          // Send response back to frontend with saved data

    } catch (err) {                                     // If something goes wrong, return error response with status 400 (Bad Request)
        res.status(400).json({error: err.message});      
    }
} 


//API logic to get all members
exports.getMembers = async (req, res) => {
    try {
        const members = await FamilyMember.find().sort({createdAt: -1});   // Find all & sort newest first
        res.json(members);    //return JSON array
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


//API logic to get single member by ID
exports.getMemberById = async (req, res) => {
    try {
        const member = await FamilyMember.findById(req.params.id);
        if(!member) return res.status(404).json({error: 'Not found'});
        res.json(member);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}