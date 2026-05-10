const { sendError } = require('../utils/response');

const parseNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const validateCoordinate = (value, field, min, max, errors) => {
  const parsed = parseNumber(value);

  if (parsed === null) {
    errors.push({
      field,
      message: `${field} must be a valid number.`
    });
    return null;
  }

  if (parsed < min || parsed > max) {
    errors.push({
      field,
      message: `${field} must be between ${min} and ${max}.`
    });
    return null;
  }

  return parsed;
};

const validateAddSchool = (req, res, next) => {
  const errors = [];

  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const address = typeof req.body.address === 'string' ? req.body.address.trim() : '';

  if (!name) {
    errors.push({
      field: 'name',
      message: 'name is required and must be a non-empty string.'
    });
  }

  if (!address) {
    errors.push({
      field: 'address',
      message: 'address is required and must be a non-empty string.'
    });
  }

  const latitude = validateCoordinate(req.body.latitude, 'latitude', -90, 90, errors);
  const longitude = validateCoordinate(req.body.longitude, 'longitude', -180, 180, errors);

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed.', errors);
  }

  req.validatedBody = {
    name,
    address,
    latitude,
    longitude
  };

  return next();
};

const validateListSchools = (req, res, next) => {
  const errors = [];

  const latitude = validateCoordinate(req.query.latitude, 'latitude', -90, 90, errors);
  const longitude = validateCoordinate(req.query.longitude, 'longitude', -180, 180, errors);

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed.', errors);
  }

  req.validatedQuery = {
    latitude,
    longitude
  };

  return next();
};

module.exports = {
  validateAddSchool,
  validateListSchools
};
