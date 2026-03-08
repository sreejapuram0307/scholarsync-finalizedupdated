const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  scholarshipsRecommended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }]
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
