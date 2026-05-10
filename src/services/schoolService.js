const schoolRepository = require('../repositories/schoolRepository');
const AppError = require('../utils/appError');

const addSchool = async (schoolPayload) => {
  const existingSchool = await schoolRepository.getSchoolByNameAndAddress(
    schoolPayload.name,
    schoolPayload.address
  );

  if (existingSchool) {
    throw new AppError(409, 'School with the same name and address already exists.', {
      field: 'name,address',
      message: 'Duplicate school entry.'
    });
  }

  try {
    const schoolId = await schoolRepository.insertSchool(schoolPayload);

    return {
      id: schoolId,
      ...schoolPayload
    };
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      throw new AppError(409, 'School with the same name and address already exists.', {
        field: 'name,address',
        message: 'Duplicate school entry.'
      });
    }

    throw error;
  }
};

const listSchools = async (latitude, longitude) => {
  return schoolRepository.listSchoolsByDistance(latitude, longitude);
};

module.exports = {
  addSchool,
  listSchools
};
