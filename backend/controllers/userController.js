import User from '../model/user'


// get user details (logged in user details only) api function/logic
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.User.id).select("-password")
        if(!user) {
            console.log("user not found in db")
            return
        }
        return res.json(user)
    } catch (err) {
        console.error("User not found in db:", err)
    }
}
