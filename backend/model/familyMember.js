const mongoose = require("mongoose");
//const { type } = require("os");
//const { ref } = require("process");

const familyMembSchema = new mongoose.Schema(
    {
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
            enum: ['male', 'female', 'unknown'],
            required: true
        },
        dateOfBirth: {
            type: Date
        },
        dateOfDeath: {
            type: Date
        },
        // relation: {
        //     type: String,
        //     enum: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin', 'Grandpa', 'Grandma', 'Other'],
        //     required: true
        // },
        photoUrl: {
            type: String,   //local or cloudinary url
            default: ''
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        occupation: {
            type: String
        },
        loaction: {
            type: String
        },


        //relationships
        fatherId: {type: mongoose.Schema.Types.ObjectId, ref: 'familyMember'},
        motherId: {type: mongoose.Schema.Types.ObjectId, ref: 'familyMember'},
        spouseId: {type: mongoose.Schema.Types.ObjectId, ref: 'familyMember'},
        childernIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'familyMember', default: [] }],


        // family tree info
        genereation: {type: Number, required: true},
        side: {type: String, enum:['paternal', 'maternal', 'current'], required: true},

        //additional info
        notes: {type: String},
        isAlive: {type: Boolean, default: true, required: true},


        
    }, {
        timestamps: true
    }
);

const familyMember = mongoose.model("familyMember", familyMembSchema)
module.exports = familyMember