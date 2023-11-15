const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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

// Setting the default views folder to an absolute path
app.use(express.urlencoded({ extended: true }));

// Setting the default views folder to an absolute path
app.use(methodOverride("_method"));

// Routes to the home page
app.get("/", (req, res) => {
    res.render("home");
});

// Routes to all campgrounds
app.get("/campgrounds", async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
});

// Routes to all campgrounds
app.post("/campgrounds", async (req, res) => {
    console.log(req.body);
    const { title, price, description, location } = req.body;

    const newCamp = new Campground({ title, price, description, location });

    await newCamp.save();

    res.redirect("/campgrounds");
});

// Routes to all campgrounds
app.patch("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const { title, price, description, location } = req.body;

    const update = { title, price, description, location };

    console.log(id);
    console.log(update);

    const campToUpdate = await Campground.findByIdAndUpdate(id, update, {
        new: true,
    });

    console.log(campToUpdate);

    res.redirect(`/campgrounds/${id}`);
});

// Routes to all campgrounds
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;

    console.log(id);
    const deletedCamp = await Campground.findByIdAndDelete(id);

    console.log(`${deletedCamp.title} has been deleted!!`);

    res.redirect(`/campgrounds`);
});

// Routes to the new page
app.get("/campgrounds/new", async (req, res) => {
    res.render("campgrounds/new", { cities });
});

// Routes to show page
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const camp = await Campground.findById(id);
        res.render("campgrounds/show", { camp });
    } catch (err) {
        console.log(err);
        res.send("Not Found");
    }
});

// Routes to show page
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp, cities });
});

// Binds and listens to connections on the specified port
app.listen(port, () => {
    console.log(`Serving on port: ${port}`);
});
