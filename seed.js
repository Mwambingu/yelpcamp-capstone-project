const mongoose = require("mongoose");
const Campgrounds = require("./models/campground");
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

    for (i = 0; i < 10; i++) {
        let city = getCity();
        camp = new Campgrounds({
            title: getCampName(),
            price: Math.floor(Math.random() * 101),
            description: "camp",
            location: city.city,
        });

        console.log(camp);

        await camp.save();
    }
}
