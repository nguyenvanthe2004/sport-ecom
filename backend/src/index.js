const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")

const port = 8000;
const db = require("./config/db");

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

db.connect();

app.get("/", (req, res) => {
    res.send("Hello Express");
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

