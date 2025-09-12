import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    dateOfBirth: {
      type: Date,
    },
    dateOfDeath: {
      type: Date,
    },
    // relation: {
    //     type: String,
    //     enum: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin', 'Grandpa', 'Grandma', 'Other'],
    //     required: true
    // },
    photo: {
      type: String, //local or cloudinary url
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    occupation: {
      type: String,
    },
    address: {
      type: String,
    },

    //relationships
    fatherId: { type: mongoose.Schema.Types.ObjectId, ref: "familyMember" },
    motherId: { type: mongoose.Schema.Types.ObjectId, ref: "familyMember" },
    spouseId: { type: mongoose.Schema.Types.ObjectId, ref: "familyMember" },
    childrenIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "familyMember",
      },
    ],

    // family tree info
    generation: { type: Number, default: 0 },
    side: {
      type: String,
      enum: ["paternal", "maternal", "current"],
      default: "current",
    },

    //additional info
    notes: { type: String },
    isAlive: { type: Boolean, default: true},
  },
  {
    timestamps: true,
  }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

export default FamilyMember;