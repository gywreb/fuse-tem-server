const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/")
  .get(userController.getAll)
  .post(upload.single("photoUrl"), userController.createNewUser);

module.exports = router;
