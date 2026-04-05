import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema(
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
    versionNumber: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: '',
      trim: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    templateId: {
      type: String,
      default: 'classic',
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    jobDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

resumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);

export default ResumeVersion;