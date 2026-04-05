import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const chatHistorySchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agentType: {
      type: String,
      enum: ['interview', 'bulletWriter', 'atsScorer', 'reviewer'],
      required: true,
    },
    messages: [messageSchema],
    metadata: {
      sectionTargeted: { type: String, default: '' },
      completedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

chatHistorySchema.index({ resumeId: 1, agentType: 1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;