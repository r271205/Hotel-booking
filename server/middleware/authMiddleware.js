import User from "../models/User.js";

//middleware to check if user is authenticated
export const protect = async (req, res) => {
    const {userId} = req.auth;
    if(!userId){
        res.json({success : false , message:"Not Authenticated!"})
    }else{
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
}