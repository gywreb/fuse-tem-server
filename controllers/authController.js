const User = require("../database/models/User");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

exports.register = asyncMiddleware(async (req, res, next) => {
  const { displayName, password, email } = req.body;
  const user = new User({
    password,
    data: {
      displayName,
      email,
    },
  });
  const newUser = await user.save();
  const resposneUser = _.omit(newUser._doc, "password");

  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(200).json({ user: resposneUser, access_token });
});

exports.login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ "data.email": email });

  if (!user)
    return next(new ErrorResponse(404, { email: "Check your username/email" }));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return next(new ErrorResponse(404, { password: "Check your password" }));

  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(200).json({ user, access_token });
});

exports.getCurrentUser = (req, res, next) => {
  const { user, updatedAccessToken } = req;
  res.status(200).json({ user, access_token: updatedAccessToken });
};
