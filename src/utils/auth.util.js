import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY} //1d  
    )
};

export const sendToken = (user, res) => {
    const token = generateToken(user);
    res.cookie("uid", token);
    const { name, username, email, profilePic } = user; 
    return res.status(200).json(
        {
            message: "Login Sucessfull!",
            user: { name, username, email, profilePic },
        }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch {
        return null;
    }
};