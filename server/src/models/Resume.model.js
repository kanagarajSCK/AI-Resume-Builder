import mongoose from 'mongoose';

// Nested subdocument schemas (MongoDB: Embedded Documents)
const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  bullets: [{ type: String }],
}, { _id: true });

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  bullets: [{ type: String }],
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: true });

const atsBreakdownSchema = new mongoose.Schema({
  keywordMatch: { type: Number, default: 0 },
  formatting: { type: Number, default: 0 },
  sectionCompleteness: { type: Number, default: 0 },
  bulletQuality: { type: Number, default: 0 },
  summaryStrength: { type: Number, default: 0 },
  skillCoverage: { type: Number, default: 0 },
  quantification: { type: Number, default: 0 },
  actionVerbs: { type: Number, default: 0 },
  length: { type: Number, default: 0 },
  contactInfo: { type: Number, default: 0 },
}, { _id: false });

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
      trim: true,
    },
    templateId: {
      type: String,
      enum: ['classic', 'modern', 'creative', 'minimal', 'executive'],
      default: 'classic',
    },
    targetRole: {
      type: String,
      default: '',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    sections: {
      personalInfo: {
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedIn: { type: String, default: '' },
        portfolio: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      experience: [experienceSchema],
      education: [educationSchema],
      skills: {
        technical: [{ type: String }],
        soft: [{ type: String }],
        languages: [{ type: String }],
      },
      projects: [projectSchema],
      certifications: [certificationSchema],
    },
    atsScore: {
      overall: { type: Number, default: 0 },
      breakdown: { type: atsBreakdownSchema, default: () => ({}) },
      missingKeywords: [{ type: String }],
      suggestions: [{ type: String }],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;