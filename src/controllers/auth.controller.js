import { asyncHandler } from "../utils/asyncHandler.util.js";

import { checkFields } from "../validations/auth.validate.js";
import { sendToken } from "../utils/auth.util.js";
import User from "../models/user.model.js";



const registerUser = asyncHandler( async (req, res) => {
    const user = new User(req.body);
    await user.save();
    return sendToken(user, res);
});

const loginUser = asyncHandler ( async (req, res) => {
    const { username, password } = req.body;

    const flag = checkFields([username, password]);
    if (flag==null){return res.status(400).json({ message: "Require username and password" });}
   
    const user = await User.findOne({ username });
    if (!user) {return res.status(400).json({ message: "Incorrect username or password" });}

    const isPasswordMatch = await user.checkPassword(password);
    if (!isPasswordMatch){return res.status(400).json({ message: "Incorrect username or password" });}
    
    return sendToken(user, res);
});


export {
    registerUser,
    loginUser,
};