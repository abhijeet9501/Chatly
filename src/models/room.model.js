import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomType: {
            type: String,
            enum: ['global', 'random', 'private'],
            required: true
        },
        roomId: {
            type: String,
        },          
        users: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        isActive: {
            type: Boolean,
            default: true
        }
          
    }
    , {timestamps: true});


const Room = mongoose.model("Room", roomSchema);

export default Room;
