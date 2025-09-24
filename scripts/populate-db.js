const { MongoClient } = require("mongodb");
const axios = require("axios");
require("dotenv").config();

console.log("DB Population Script");

async function populateDatabase() {
  let client;

  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://mongodb:27017/country-explorer";
    const REST_COUNTRIES_API_URL =
      process.env.REST_COUNTRIES_API_URL || "https://restcountries.com/v3.1";

    // connect to db
    console.log("Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("country-explorer");
    const collection = db.collection("countries");

    // check for existing data
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} countries`);
      console.log("Skipping population");
      return;
    }

    // fetch data from external API
    const basicFields =
      "name,cca2,cca3,capital,region,population,flags,currencies,continents";
    console.log("Fetching countries data from REST Countries API...");
    const response = await axios.get(
      `${REST_COUNTRIES_API_URL}/all?fields=${basicFields}`,
      {
        timeout: 30000,
      }
    );

    const countriesData = response.data;
    console.log(`Fetched ${countriesData.length} countries from API`);

    // Insert data into db
    console.log("Inserting countries into DB...");
    const result = await collection.insertMany(countriesData, {
      ordered: false,
    });

    console.log(`Successfully inserted ${result.insertedCount} countries`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("Database connection closed");
    }
  }
}

populateDatabase();
