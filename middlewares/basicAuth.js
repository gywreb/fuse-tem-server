const ErrorResponse = require("../models/ErrorResponse");

const basicAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Basic")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new ErrorResponse(401, "Basic token is required"));

  const decode = new Buffer.from(token, "base64").toString();

  if (
    `${process.env.BASICAUTH_USER}:${process.env.BASICAUTH_PASSWORD}` === decode
  ) {
    next();
  } else {
    next(new ErrorResponse(401, "Basic token is invalid"));
  }
};

module.exports = basicAuth;
