const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jwtAuth = require("../middlewares/jwtAuth");
const basicAuth = require("../middlewares/basicAuth");

router.post("/register", basicAuth, authController.register);
router.post("/login", basicAuth, authController.login);
router.get("/current", jwtAuth, authController.getCurrentUser);

module.exports = router;
