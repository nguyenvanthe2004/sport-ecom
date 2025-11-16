const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

class UserController {
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalUsers = await Users.countDocuments();

      const users = await Users.find()
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalPages = Math.ceil(totalUsers / limit);
      res.status(200).json({
        page,
        limit,
        totalPages,
        totalUsers,
        users,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password is incorrect!" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          fullname: user.fullname,
          address: user.address,
          phone: user.phone,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "none", 
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          userId: user._id,
          email: user.email,
          fullname: user.fullname,
          address: user.address,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, password, fullname } = req.body;

      if (!email || !password || !fullname) {
        return res
          .status(400)
          .json({ message: "Email, password and fullname are required" });
      }

      const exitsingUser = await Users.findOne({ email });

      if (exitsingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = new Users({
        email,
        password: hashedPassword,
        fullname,
        role: "user",
      });
      const savedUser = await newUser.save();
      console.log("Saved user:", savedUser);

      res.json({
        message: "User registered successfully",
        user: {
          userId: savedUser._id,
          email: savedUser.email,
          fullname: savedUser.fullname,
        },
      });
    } catch (error) {
      console.log("Error during registration:", error);

      res.status(500).json({ message: error.message });
    }
  }

  async current(req, res) {
    try {
      res.json({
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async editUser(req, res) {
    try {
      const { email, fullname } = req.body;
      const userId = req.user.userId;
      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { email, fullname },
        { new: true }
      );
      res.json({
        message: "User updated successfully",
        user: {
          userId: updatedUser._id,
          email: updatedUser.email,
          fullname: updatedUser.fullname,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.userId;
      const user = await Users.findById(userId);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect!" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async removeUser(req, res) {
    try {
      const userId = req.user.userId;
      await Users.findByIdAndDelete(userId);
      res.json({ message: "User removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new UserController();
