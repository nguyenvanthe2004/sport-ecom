const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

function verifyUser(req, res, next) {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded JWT: ", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

function verifyAdmin(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = { verifyUser, verifyAdmin };
