const sendSuccess = (res, statusCode, message, data) => {
  const payload = {
    success: true,
    message
  };

  if (typeof data !== 'undefined') {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, message, errors) => {
  const payload = {
    success: false,
    message
  };

  if (errors) {
    payload.errors = Array.isArray(errors) ? errors : [errors];
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError
};
