const User = require("../database/models/User");
const asyncMiddleware = require("../middlewares/asyncMiddleware");

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
