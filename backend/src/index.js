const express = require("express");
const app = express();

const port = 8000;
const db = require("./config/db");

db.connect();

app.get("/", (req, res) => {
    res.send("Hello Express");
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

