const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true, default: [] },
  features: { type: [String], required: true, default: [] },
  role: { type: String, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: mongoose.Schema.Types.Mixed, required: false },
  githubLink: { type: String, required: false },
  demoLink: { type: String, required: false },
  image: { type: String, required: false },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
