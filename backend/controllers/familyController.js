//all API's logic based on familyMember model goes here

// importing model
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
        const members = await FamilyMember.find().sort({createdAt: -1});
        res.status(200).josn(members);
    } catch (err) {
        res.status(400).json({error:err.message});
    }
}