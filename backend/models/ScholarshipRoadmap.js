const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  stage: { type: String, required: true },
  description: { type: String },
  careerOptions: [{ type: String }],
  scholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
  estimatedAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' }
});

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentEducation: { type: String, required: true },
  targetCareer: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  milestones: [milestoneSchema],
  totalEstimatedFunding: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ScholarshipRoadmap', roadmapSchema);
