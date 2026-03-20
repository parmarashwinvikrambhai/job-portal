import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      default: 'full-time',
    },
    salary: {
      min:      { type: Number, default: 0 },
      max:      { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    experience: {
      type: String,
      enum: ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
      default: 'fresher',
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);
const Job = mongoose.model("Job",jobSchema);
export default Job