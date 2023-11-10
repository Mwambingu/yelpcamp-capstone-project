const mongoose = require("mongoose");
const Campgrounds = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

const cities = require("./cities");

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const getCampName = () => {
    let descrIndex = getRandomInt(descriptors.length);
    let placeIndex = getRandomInt(places.length);

    return `${descriptors[descrIndex]} ${places[placeIndex]}`;
};

const getCity = () => {
    let cityIndex = getRandomInt(cities.length);
    return cities[cityIndex];
};

main().catch((err) => console.log(err));

async function main() {
    mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("Connected to DB....");

    await Campgrounds.deleteMany({});

    for (i = 0; i < 100; i++) {
        let city = getCity();
        camp = new Campgrounds({
            title: getCampName(),
            price: Math.floor(Math.random() * 101),
            description: "camp",
            location: `${city.city}, ${city.state}`,
        });

        console.log(camp);

        await camp.save();
    }
}

main().then(() => {
    mongoose.connection.close();
});
