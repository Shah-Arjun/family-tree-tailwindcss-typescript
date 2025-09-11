//all API's logic based on familyMember model goes here

// importing model
import { error } from "console";
import FamilyMember from "../model/familyMember.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// API logic to add family member
export const addMember = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path); // upload to cloudinary
      if (uploaded) {
        data.photo = uploaded.secure_url;
      }
    }
    const member = new FamilyMember(data); //frontend bata aako data member(document/ mongoDB object) banayr tesma ma rakh, req.body = the data sent from frontend (JSON form data)
    const saved = await member.save(); // Save the new member to MongoDB
    res.status(200).json(saved); // Send response back to frontend with saved data
  } catch (err) {
    // If something goes wrong, return error response with status 400 (Bad Request)
    res.status(400).json({ error: err.message });
  }
};

//API logic to get all members
export const getMembers = async (req, res) => {
  try {
    const members = await FamilyMember.find().sort({ createdAt: -1 }); // Find all & sort newest first
    res.json(members); //return JSON array
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      const uploaded = await uploadOnCloudinary(req.file.path);
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
  try {
    const deleted = await FamilyMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
