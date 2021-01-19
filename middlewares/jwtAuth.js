const ErrorResponse = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");

const jwtAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return next(new ErrorResponse(401, "Invalid access token detected"));

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  try {
    req.user = await User.findOne({ _id: decode.id });
    if (!req.user)
      return next(new ErrorResponse(401, "Invalid access token detected"));
    req.updatedAccessToken = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    next();
  } catch (error) {
    next(new ErrorResponse(401, "Invalid access token detected"));
  }
};

module.exports = jwtAuth;
