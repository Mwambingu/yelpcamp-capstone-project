const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

main().catch((err) => console.log(err));

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
    console.log("Connected to DB...");
}

app = express();
port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Serving on port: ${port}`);
});
