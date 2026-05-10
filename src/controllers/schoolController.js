const schoolService = require('../services/schoolService');
const { sendSuccess } = require('../utils/response');

const addSchool = async (req, res, next) => {
  try {
    const addedSchool = await schoolService.addSchool(req.validatedBody);
    return sendSuccess(res, 201, 'School added successfully.', addedSchool);
  } catch (error) {
    return next(error);
  }
};

const listSchools = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.validatedQuery;
    const schools = await schoolService.listSchools(latitude, longitude);
    return sendSuccess(res, 200, 'Schools fetched successfully.', schools);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addSchool,
  listSchools
};
