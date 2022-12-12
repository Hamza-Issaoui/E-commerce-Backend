const mongoose = require("mongoose");
const schemaUser = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    picture: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        require: false,
    },
    resetPassWordToken: {
        type: String,
        require: false,
    },
    
    
},
{timestamps:true}
);
module.exports = mongoose.model("User", schemaUser);

