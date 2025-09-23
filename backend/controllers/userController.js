import User from "../model/user.js";

// get user details (logged in user details only)
export const getUser = async (req, res) => {
  try {
    // Corrected: use req.user, not req.User
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      console.log("User not found in db");
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user from db:", err);
    res.status(500).json({ message: "Server error" });
  }
};
