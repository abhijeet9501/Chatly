import {verifyAnon} from "../utils/anonUser.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const verifyAnonToken = asyncHandler (async (req, res, next) => {
    const token = req.cookies?.anonToken;
    if (!token || token=="") {return next();};

    const decoded = verifyAnon(token);
    if (decoded)
    {
        const anonName = decoded.nameID;
        return res.status(200).json({
            message: "Anon user already assigned!",
            anonName,
        });
    };
    next();
});