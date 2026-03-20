import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant is required'],
    },
    resume: {
      type: String, 
      required: [true, 'Resume is required'],
    },
    coverLetter: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    recruiterNote: {
      type: String,
      default: '',  
    },
  },
  { timestamps: true }
);
const Application = mongoose.model("Application",applicationSchema);
export default Application