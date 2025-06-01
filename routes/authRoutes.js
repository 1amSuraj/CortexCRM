const express = require("express");
const passport = require("passport");
const router = express.Router();
const { loginSuccess, logout } = require("../controllers/authController");

// Initiate Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Redirect with JWT
    res.redirect(`http://localhost:3000/auth/success?token=${req.user.token}`);
  }
);

// Get JWT after login
router.get("/login/success", loginSuccess);

// Logout
router.get("/logout", logout);

module.exports = router;
