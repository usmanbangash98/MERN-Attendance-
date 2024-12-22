const jwt = require("jsonwebtoken");

// Middleware for general authentication
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Authorization Header:", authHeader); // Debugging info
  // Check if token is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No token or incorrect format");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming payload contains `user`
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("Expired token:", err.message);
      return res
        .status(401)
        .json({ msg: "Token has expired, please log in again" });
    }
    console.error("JWT verification failed:", err.message); // Debugging info
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
  try {
    auth(req, res, () => {
      if (!req.user || !req.user.isAdmin) {
        console.error("Admin access denied for user:", req.user); // Debugging info
        return res.status(403).json({ msg: "Access denied. Admins only." });
      }
      next();
    });
  } catch (err) {
    console.error("Admin authentication error:", err.message); // Debugging info
    res.status(500).json({ msg: "Server error during admin authentication" });
  }
};

module.exports = { auth, adminAuth };
