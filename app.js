const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

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

// Setting the layout engine as ejs-mate
app.engine("ejs", ejsMate);

// Setting the native template rendering engine to ejs
app.set("view engine", "ejs");

// Setting the default views folder to an absolute path
app.set("views", path.join(__dirname, "views"));

// Setting urlencoded as the default parser for URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Setting the default views folder to an absolute path
app.use(methodOverride("_method"));

// Setting up static files access
console.log(path.join(__dirname, "public"));
app.use("/static", express.static("public"));

// Routes to the home page
app.get("/", (req, res) => {
    const pageTitle = "YelpCamp";
    res.render("home", { pageTitle });
});

// Routes to all campgrounds
app.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
        const camps = await Campground.find({});
        const pageTitle = "All Campgrounds";
        res.render("campgrounds/index", { camps, pageTitle });
    })
);

// Routes to all campgrounds
app.post(
    "/campgrounds",
    catchAsync(async (req, res, next) => {
        if (!req.body) {
            throw new ExpressError("Invalid Campground Data", 400);
        }
        console.log(req.body);
        const { title, price, description, location, image } = req.body;

        const newCamp = new Campground({
            title,
            price,
            description,
            location,
            image,
        });

        await newCamp.save();

        res.redirect(`/campgrounds/${newCamp.id}`);
    })
);

// Updates a campgrounds details
app.patch(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
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
    })
);

// Deletes a specified campground
app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;

        console.log(id);
        const deletedCamp = await Campground.findByIdAndDelete(id);

        console.log(`${deletedCamp.title} has been deleted!!`);

        res.redirect(`/campgrounds`);
    })
);

// Routes to the new page
app.get(
    "/campgrounds/new",
    catchAsync(async (req, res) => {
        const pageTitle = "New Campground";
        res.render("campgrounds/new", { cities, pageTitle });
    })
);

// Routes to show page
app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        const pageTitle = camp.title;
        res.render("campgrounds/show", { camp, pageTitle });
    })
);

// Routes to the edit campground page
app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const pageTitle = "Edit Campground";
        camp = await Campground.findById(id);
        res.render("campgrounds/edit", { camp, cities, pageTitle });
    })
);

// Setting up a 404 error page
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Setting up a custom error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    const pageTitle = "Error Page";

    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err, pageTitle });
});

// Binds and listens to connections on the specified port
app.listen(port, () => {
    console.log(`Serving on port: ${port}`);
});
