const ErrorResponse = require("../models/ErrorResponse");
const ConnectMongoDB = require("../database/dbConnect");

const errorHandler = (err, req, res, next) => {
  let errors = { ...err };

  // file type error
  if (err.message && err.name === "Error") {
    errors = new ErrorResponse(400, err.message);
  }

  // mongoose validator happen
  else if (err.name === "ValidationError") {
    errors = new ErrorResponse(400, {});
    for (let errorField in err.errors) {
      let error_id = null;
      if (errorField.includes(".")) {
        error_id = errorField.slice(errorField.lastIndexOf(".") + 1);
      }
      errors.error[error_id ? error_id : errorField] =
        err.errors[errorField].message;
    }
    // delete file in bucket if validation failed
    if (req.file) ConnectMongoDB.gfs.delete(req.file.id);
  }

  // mongoose duplicate key
  else if (err.code === 11000) {
    errors = new ErrorResponse(400, {});
    for (let error_id in err.keyValue) {
      if (error_id.includes("."))
        error_id = error_id.slice(error_id.lastIndexOf(".") + 1);
      errors.error[error_id] = `The ${error_id} is already in use`;
    }
    if (req.file) ConnectMongoDB.gfs.delete(req.file.id);
  }

  console.log(err.name, err.message);

  res
    .status(errors.status || 500)
    .json({ error: errors.error || "Server error!" });

  next();
};

module.exports = errorHandler;
