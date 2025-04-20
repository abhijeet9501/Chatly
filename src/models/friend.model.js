import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        friend: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        room: {
            type: mongoose.Types.ObjectId,
            ref: "Room",
            required: true,
        },
    },
    { timestamps: true }
);


friendSchema.pre("save", function (next) {
    if (this.user.toString() > this.friend.toString()) {
        [this.user, this.friend] = [this.friend, this.user];
    }
    next();
});

friendSchema.index({ user: 1, friend: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
