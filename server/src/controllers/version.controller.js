import * as versionService from '../services/version.service.js';

export const saveVersion = async (req, res, next) => {
  try {
    const { label } = req.body;
    const version = await versionService.saveVersion(req.params.resumeId, req.user._id, label);
    return res.status(201).json({ success: true, data: version });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const getVersions = async (req, res, next) => {
  try {
    const versions = await versionService.getVersions(req.params.resumeId, req.user._id);
    return res.json({ success: true, data: versions });
  } catch (error) {
    next(error);
  }
};

export const getVersion = async (req, res, next) => {
  try {
    const version = await versionService.getVersionById(
      req.params.resumeId,
      req.params.versionId,
      req.user._id
    );
    return res.json({ success: true, data: version });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const restoreVersion = async (req, res, next) => {
  try {
    const resume = await versionService.restoreVersion(
      req.params.resumeId,
      req.params.versionId,
      req.user._id
    );
    return res.json({ success: true, data: resume });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const deleteVersion = async (req, res, next) => {
  try {
    await versionService.deleteVersion(req.params.resumeId, req.params.versionId, req.user._id);
    return res.json({ success: true, data: { message: 'Version deleted successfully' } });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};