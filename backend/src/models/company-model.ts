import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
     description: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'Location is required'],
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Suspended"],
      default: "Pending",
    },
    logo: {
      type: String,    
      default: '',
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required'],
    },
  },
  { timestamps: true }
);
const Company = mongoose.model("Company",companySchema);
export default Company