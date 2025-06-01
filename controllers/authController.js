exports.loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "Login successful",
      token: req.user.token,
      user: req.user.user,
    });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
};
