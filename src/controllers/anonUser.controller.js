import { signAnon } from "../utils/anonUser.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const signAnonToken = asyncHandler ( async(req, res) => {
    const { name } = req.body;
    if (!name || name=="") {return res.status(400).json({message: "Enter name!"})};

    const token = signAnon(name);
    res.cookie("anonToken", token);
    return res.status(200).json({message: "Anon user assigned!"});
});

