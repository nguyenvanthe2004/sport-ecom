const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/SportWeb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch(err) {
    console.log("Failed to connect to MongoDB", err);
  }
}

module.exports = { connect };
