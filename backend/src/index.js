const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes");

const port = 8000;
const db = require("./config/db");

db.connect();

app.get("/", (req, res) => {
    res.send("Hello Express");
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

