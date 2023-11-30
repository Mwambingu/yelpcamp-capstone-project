const mongoose = require("mongoose");
const Campgrounds = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

const campDescription =
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, voluptas, ullam aut expedita tenetur quod cumque quasi distinctio molestias aperiam minus eos eligendi, nisi quaerat alias deleniti eaque laudantium exercitationem.Praesentium dolorem sapiente harum alias, dolor natus beatae doloribus repellat eius sed molestiae explicabo ipsa quae possimus iusto sunt totam quo, facere nostrum nemo laboriosam quidem consectetur! Ullam, at atque! Fugit adipisci voluptatibus esse repellat, nostrum omnis explicabo ea officia quaerat dolorem mollitia culpa tempora molestias. Minima autem repellat iusto nemo vitae, excepturi nobis odio aut ducimus laudantium rerum quis? Voluptates eveniet atque quod rerum quasi fugiat temporibus assumenda numquam hic commodi, non distinctio voluptatem earum asperiores eum optio alias dolorum a! Ea, dignissimos iusto. Non temporibus voluptates quia? Quisquam.";

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
            description: campDescription,
            location: `${city.city}, ${city.state}`,
            image: "https://source.unsplash.com/collection/483251",
        });

        console.log(camp);

        await camp.save();
    }
}

main().then(() => {
    mongoose.connection.close();
});
