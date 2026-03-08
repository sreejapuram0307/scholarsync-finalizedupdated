const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  category: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  educationLevel: { type: String, required: true },
  instituteName: { type: String, required: true },
  gpa10: { type: Number },
  gpa12: { type: Number },
  guardianOccupation: { type: String },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
