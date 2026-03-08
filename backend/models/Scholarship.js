const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apply_link: { type: String, required: true },
  category: { type: String, required: true },
  maxIncome: { type: Number, required: true },
  educationLevel: { type: String, required: true },
  deadline: { type: Date, required: true },
  startDate: { type: Date, required: true },
  scholarshipAmount: { type: Number, required: true },
  stackable: { type: Boolean, default: true },
  eligibilityRules: [String],
  documentsRequired: [String],
  trustScore: { type: Number, default: 95 },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
