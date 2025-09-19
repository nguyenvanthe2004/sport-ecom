const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/SportWeb");
    console.log("Connected to MongoDB");
    
  } catch {
    console.log("Failed to connect to MongoDB");
  }
}

module.exports = { connect };
