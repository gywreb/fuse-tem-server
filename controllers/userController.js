const User = require("../database/models/User");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../models/ErrorResponse");

exports.getAll = asyncMiddleware(async (req, res, next) => {
  const users = await User.find().select("-password");
  if (!users) return next(new ErrorResponse(404, "no user found"));
  res.status(200).json(users);
});
