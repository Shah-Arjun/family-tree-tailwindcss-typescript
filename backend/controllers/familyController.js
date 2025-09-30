//all API's logic based on FamilyMember model goes here

// importing model
import FamilyMember from "../model/familyMember.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js";

// API logic to add family member
export const addMember = async (req, res) => {
  try {
    // immediately invoked function expression (IIFE)
    const allowedFields = (({
      name,
      gender,
      dateOfBirth,
      dateOfDeath,
      photo,
      email,
      phone,
      occupation,
      address,
      fatherId,
      motherId,
      generation,
      side,
      isAlive,
      notes,
    }) => ({
      name,
      gender,
      dateOfBirth,
      dateOfDeath,
      photo,
      email,
      phone,
      occupation,
      address,
      fatherId,
      motherId,
      generation,
      side,
      isAlive,
      notes,
    }))(req.body);

    // create a new user with requested data and append logged-in user id from jwt payload
    const member = new FamilyMember({
      ...allowedFields,
      userID: req.user.id, // comes from jwt payload
    });

    //const data = req.body;               // store JSON data received from frontend to data

    if (req.file) {
      //check if a file exist--handled by multer
      const uploaded = await uploadOnCloudinary(req.file.buffer); // upload to cloudinary, and response send by cloudinary is saved to uploaded variable
      if (uploaded) {
        member.photo = uploaded.secure_url; // cloudinary bata aako photo ko url data.photo ma hal
      }
    }

    //const member = new FamilyMember(data); //frontend bata aako data member(document/ mongoDB object) banayr tesma ma rakh, req.body = the data sent from frontend (JSON form data)
    const saved = await member.save(); // Save the new member to MongoDB

    res.status(200).json(saved); // Send response back to frontend with saved data
  } catch (err) {
    // If something goes wrong, return error response with status 400 (Bad Request)
    console.error("Error in addMember:", err);
    res.status(400).json({ error: err.message || "Invalid request" });
  }
};



//API logic to fetch only logged-in user members
export const getMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const members = await FamilyMember.find({ userID: userId });

    res.json(members); //return JSON array
  } catch (err) {
    console.error("Get members error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// to get member's count for logged-in user---->    /api/members/count
export const getMembersCountByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const count = await FamilyMember.countDocuments({ userID: userId })
    res.json({count})
  } catch (err) {
    console.error("Failed to fetch member count", err);
    res.status(500).json({ error: "Server error" });
  }
};



//API logic to get single member by ID
export const getMemberById = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update member by id
export const updateMember = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.buffer);
      if (uploaded) {
        data.photo = uploaded.secure_url;
      }
    }

    const updated = await FamilyMember.findByIdAndUpdate(
      req.params.id, // find by requested id
      data, // update with req data
      { new: true } // return updated data
    );

    res.json(updated); // response to frontend
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// delete member by id
export const deleteMember = async (req, res) => {
  const {id} =req.params
  try {
    const deleted = await FamilyMember.findByIdAndDelete(id);
    
    if(!deleted){
      res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member Deleted"})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
