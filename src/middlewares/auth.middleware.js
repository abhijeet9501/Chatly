import { asyncHandler } from "../utils/asyncHandler.util.js";
import { checkFields } from "../validations/auth.validate.js";
import { verifyToken } from "../utils/auth.util.js";
import User from "../models/user.model.js";

const isRegistered = asyncHandler( async (req, res, next) => {
    const {name, username, email, password} = req.body;
    const flag = checkFields([name, username, email, password]);
    if (flag==null) {return res.status(400).json({message: "All fields are required"});};
    
    const isUsername = await User.findOne({username});
    if (isUsername) {return res.status(400).json({message: "Username already exists!"});};

    const isEmail = await User.findOne({email});
    if (isEmail) {return res.status(400).json({message: "Email already exists!"});};

    next();
});

const isLoggedIn = asyncHandler ( async (req, res, next) => {
    const getToken = req.cookies?.uid;
    if (getToken){
        const token = verifyToken(getToken);
        if (token!=null) {
            const user = await User.findById(token._id);
            const { name, username, email, profilePic } = user;
            return res.status(200).json({
                message: "User already loggedin!",
                user: { name, username, email, profilePic },
            })
        };
    };
    next();
});

export {
    isRegistered,
    isLoggedIn
};