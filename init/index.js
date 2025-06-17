const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const DatawithOwner = initData.data.map( (obj) => ({ ...obj , owner:"6849503e2f51f79c1c41e691"}));
  await Listing.insertMany( DatawithOwner);
  console.log("data was reinitialized");
};

initDB();