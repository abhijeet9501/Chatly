import jwt from "jsonwebtoken";
import "dotenv/config"


const generateAnonName = (name) => {
    const randomId =  Math.floor(1000 + Math.random() * 9000);
    return `${name}#${randomId}`;
};

export const signAnon = (name) => {
    const nameID = generateAnonName(name);
    return jwt.sign(
        {
            nameID
        },
        process.env.ANON_TOKEN_SECRET,
        {expiresIn: process.env.ANON_TOKEN_EXPIRY},
    )
};

export const verifyAnon = (token) => {
    try {
        return jwt.verify(token, process.env.ANON_TOKEN_SECRET); 
    }
    catch {
        return null;
    }
};

