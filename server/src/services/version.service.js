import Resume from '../models/Resume.model.js';
import ResumeVersion from '../models/ResumeVersion.model.js';

export const saveVersion = async (resumeId, userId, label) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    const error = new Error('Resume not found.');
    error.statusCode = 404;
    throw error;
  }

  const lastVersion = await ResumeVersion.findOne({ resumeId })
    .sort({ versionNumber: -1 });
  const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  const version = await ResumeVersion.create({
    resumeId,
    userId,
    versionNumber,
    label: label || `Version ${versionNumber}`,
    snapshot: resume.sections,
    templateId: resume.templateId,
    atsScore: resume.atsScore?.overall || 0,
    jobDescription: resume.jobDescription,
  });

  return version;
};

export const getVersions = async (resumeId, userId) => {
  const versions = await ResumeVersion.find({ resumeId, userId })
    .sort({ versionNumber: -1 })
    .select('-__v');
  return versions;
};

export const getVersionById = async (resumeId, versionId, userId) => {
  const version = await ResumeVersion.findOne({
    _id: versionId,
    resumeId,
    userId,
  });
  if (!version) {
    const error = new Error('Version not found.');
    error.statusCode = 404;
    throw error;
  }
  return version;
};

export const restoreVersion = async (resumeId, versionId, userId) => {
  const version = await getVersionById(resumeId, versionId, userId);

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    {
      $set: {
        sections: version.snapshot,
        templateId: version.templateId,
        jobDescription: version.jobDescription,
      },
    },
    { returnDocument: 'after' }
  );

  return resume;
};

export const deleteVersion = async (resumeId, versionId, userId) => {
  const version = await ResumeVersion.findOneAndDelete({
    _id: versionId,
    resumeId,
    userId,
  });
  if (!version) {
    const error = new Error('Version not found.');
    error.statusCode = 404;
    throw error;
  }
  return version;
};