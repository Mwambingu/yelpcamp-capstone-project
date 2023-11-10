const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const cities = require("./seeds/cities");
const Campground = require("./models/campground");

main().catch((err) => console.log(err));

// Connecting mongoose to the DB
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
    console.log("Connected to DB...");
}

// Initializing the express app
app = express();
port = 3000;

// Setting the native template rendering engine to ejs
app.set("view engine", "ejs");

// Setting the default views folder to an absolute path
app.set("views", path.join(__dirname, "views"));

// Routes to the home page
app.get("/", (req, res) => {
    res.render("home");
});

// Routes to all campgrounds
app.get("/campgrounds", async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
});

// Binds and listens to connections on the specified port
app.listen(port, () => {
    console.log(`Serving on port: ${port}`);
});
