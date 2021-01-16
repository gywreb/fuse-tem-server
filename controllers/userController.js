const User = require("../database/models/User");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../models/ErrorResponse");

exports.createNewUser = asyncMiddleware(async (req, res, next) => {
  const { password, role, displayName, email } = req.body;
  const user = new User({
    password,
    role,
    data: {
      displayName,
      photoUrl: req.file ? req.file.filename : null,
      email,
    },
  });
  const newUser = await user.save();
  res.status(200).json(newUser);
});

exports.getAll = asyncMiddleware(async (req, res, next) => {
  const users = await User.find().select("-password");
  if (!users) return next(new ErrorResponse(404, "no user found"));
  res.status(200).json(users);
});
