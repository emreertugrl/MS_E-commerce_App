const express = require("express");
const AuthController = require("./auth.controller");
const authenticate = require("./auth.middleware");
const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

router.get("/profile", authenticate, AuthController.getProfile);

module.exports = router;
