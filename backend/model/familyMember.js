const mongoose = require("mongoose");
const { type } = require("os");
const { ref } = require("process");

const familyMembSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dob: {
        type: Date
    },
    dod: {
        type: Date
    },
    side: {
        type: String,
        enum: ['Paternal', 'Maternal'],
        required: true
    },
    relation: {
        typeS: String,
        enum: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin', 'Grandpa', 'Grandma', 'Other'],
        required: true
    },
    photoUrl: {
        type: String,   //local or cloudinary url
        default: ''
    }

    
}, {
    timestamps: true
});

const familyMember = mongoose.model("familyMember", familyMembSchema)
module.exports = familyMember