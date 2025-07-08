const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Remote", 
  },
  salary: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Freelance"],
    default: "Full-time",
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  applyBy: {
    type: Date,
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;