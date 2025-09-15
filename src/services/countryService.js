import axios from "axios";
import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";

class CountryService {
  constructor() {
    this.apiUrl =
      process.env.REST_COUNTRIES_API_URL || "https://restcountries.com/v3.1";
    this.useApiDataSource = process.env.USE_API_DATA_SOURCE === "true";
  }

  /* Fetch all countries from the REST API */
  async fetchAllCountriesFromAPI() {
    try {
      const basicFields =
        "name,cca2,cca3,capital,region,population,flags,currencies,continents";
      let response;

      try {
        response = await axios.get(`${this.apiUrl}/all?fields=${basicFields}`, {
          timeout: 30000,
        });
      } catch (fieldsError) {
        console.log("Fields parameter failed");

        response = await axios.get(`${this.apiUrl}/all`, {
          timeout: 30000,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching countries from API:", error);
      throw new Error(`Failed to fetch countries from API: ${error.message}`);
    }
  }

  /* Populate MongoDB with countries data from API */
  async populateDatabase() {
    try {
      await connectToDatabase();

      // If countries already exists then skip population
      const existingCount = await Country.countDocuments();
      if (existingCount > 0) {
        console.log(`Database already contains ${existingCount} countries.`);
        return {
          message: `Database already populated with ${existingCount} countries`,
          count: existingCount,
        };
      }

      console.log("Fetching countries data from API");
      const countriesData = await this.fetchAllCountriesFromAPI();

      console.log(`Inserting ${countriesData.length} countries into DB`);
      await Country.insertMany(countriesData);

      console.log("Database population completed successfully");
      return {
        message: "Database populated successfully",
        count: countriesData.length,
      };
    } catch (error) {
      console.error("Error populating database:", error);
      throw error;
    }
  }
}

const countryServiceObject = new CountryService();
export default countryServiceObject;
