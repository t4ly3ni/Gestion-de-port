import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    password : { 
        type: String,
        required: true, 
    },
    role: {
        type: String,
        enum: ['admin', 'agent'],
        default: 'agent',
    },
});

const User = mongoose.model('User', UserSchema);
export default User;