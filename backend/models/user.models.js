import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const userSchema = new Schema({
    isTeam: {
        type: Boolean,
        default: false
    },
    name: String, 
    email: String, 
    phone: String, 
    college: String, 
    teamName: String,
    teamCollege: String, 
    members: [memberSchema] 
}, {
    timestamps: true,
    minimize: false,
});

const User = mongoose.models.user || mongoose.model("User", userSchema);

export default User;
