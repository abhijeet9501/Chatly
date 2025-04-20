import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {         
        user: {
                type: String,
            },
        anonUser: {
            type: String,
            default: null
        },
        message:{
                type: String,
                required: true,
            },
        room: {
            type: mongoose.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
    }
    , {timestamps: true});


const Message = mongoose.model("Message", messageSchema);

export default Message;
