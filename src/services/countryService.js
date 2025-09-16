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

  /* Search countries with filters and options */
  async searchCountries(
    query = "",
    continent = "",
    page = 1,
    limit = 12,
    sortBy = "name"
  ) {
    try {
      if (this.useApiDataSource) {
        return await this.searchCountriesFromAPI(
          query,
          continent,
          page,
          limit,
          sortBy
        );
      } else {
        return await this.searchCountriesFromDB(
          query,
          continent,
          page,
          limit,
          sortBy
        );
      }
    } catch (error) {
      console.error("Error searching countries:", error);
      throw error;
    }
  }

  /*Search countries from API*/
  async searchCountriesFromAPI(query, continent, page, limit, sortBy) {
    try {
      let url = `${this.apiUrl}/all`;

      if (query) {
        url = `${this.apiUrl}/name/${encodeURIComponent(query)}`;
      }

      const fields =
        "name,cca2,cca3,capital,region,subregion,population,flags,currencies,continents";
      const separator = url.includes("?") ? "&" : "?";
      const response = await axios.get(`${url}${separator}fields=${fields}`, {
        timeout: 10000,
      });

      let countries = response.data;

      //only show continent specific countries
      if (continent) {
        countries = countries.filter(
          (country) =>
            country.continents && country.continents.includes(continent)
        );
      }

      // Sorting
      countries = this.sortCountries(countries, sortBy);

      // Pagination
      const totalCount = countries.length;
      const startIndex = (page - 1) * limit;
      const paginatedCountries = countries.slice(
        startIndex,
        startIndex + limit
      );

      return {
        countries: paginatedCountries,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
    } catch (error) {
      console.error("Error searching countries from API:", error);
      if (error.response?.status === 404) {
        return {
          countries: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
          hasNextPage: false,
          hasPrevPage: false,
        };
      }
      throw error;
    }
  }

  /* Search countries from MongoDB */
  async searchCountriesFromDB(query, continent, page, limit, sortBy) {
    try {
      await connectToDatabase();

      let filter = {};

      //Searching
      if (query) {
        filter.$or = [
          { "name.common": { $regex: query, $options: "i" } },
          { "name.official": { $regex: query, $options: "i" } },
          { capital: { $elemMatch: { $regex: query, $options: "i" } } },
        ];
      }

      //Continent Filter
      if (continent) {
        filter.continents = continent;
      }

      //Sorting info
      let sort = {};
      switch (sortBy) {
        case "capital":
          sort = { capital: 1 };
          break;
        case "currency":
          sort = { currencies: 1 };
          break;
        case "name":
        default:
          sort = { "name.common": 1 };
          break;
      }

      //Query execution with filters and sort info, and pagination
      const [countries, totalCount] = await Promise.all([
        Country.find(filter)
          .select(
            "name cca2 cca3 capital region subregion population flags currencies continents"
          )
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Country.countDocuments(filter),
      ]);

      return {
        countries,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
    } catch (error) {
      console.error("Error searching countries from DB:", error);
      throw error;
    }
  }

  /*Get all continents*/
  async getContinents() {
    try {
      if (this.useApiDataSource) {
        return [
          "Africa",
          "Antarctica",
          "Asia",
          "Europe",
          "North America",
          "Oceania",
          "South America",
        ];
      } else {
        await connectToDatabase();
        const continents = await Country.distinct("continents");
        return continents.sort();
      }
    } catch (error) {
      console.error("Error getting continents:", error);
      throw error;
    }
  }

  /* Autocomplete country suggestions */
  async getCountrySuggestions(query, continent = "", limit = 10) {
    try {
      if (this.useApiDataSource) {
        return await this.getCountrySuggestionsFromAPI(query, continent, limit);
      } else {
        return await this.getCountrySuggestionsFromDB(query, continent, limit);
      }
    } catch (error) {
      console.error("Error getting country suggestions:", error);
      throw error;
    }
  }

  /*Suggestions from API */
  async getCountrySuggestionsFromAPI(query, continent, limit) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/name/${encodeURIComponent(
          query
        )}?fields=name,continents`,
        {
          timeout: 5000,
        }
      );

      let countries = response.data;

      if (continent) {
        countries = countries.filter(
          (country) =>
            country.continents && country.continents.includes(continent)
        );
      }

      return countries.slice(0, limit).map((country) => ({
        name: country.name.common,
        official: country.name.official,
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /*suggestions from MongoDB*/
  async getCountrySuggestionsFromDB(query, continent, limit) {
    try {
      await connectToDatabase();

      let filter = {
        $or: [
          { "name.common": { $regex: query, $options: "i" } },
          { "name.official": { $regex: query, $options: "i" } },
        ],
      };

      if (continent) {
        filter.continents = continent;
      }

      const countries = await Country.find(filter)
        .select("name")
        .limit(limit)
        .lean();

      return countries.map((country) => ({
        name: country.name.common,
        official: country.name.official,
      }));
    } catch (error) {
      console.error("Error getting suggestions from DB:", error);
      throw error;
    }
  }

  /*get country details by country code*/
  async getCountryDetails(countryCode) {
    try {
      if (this.useApiDataSource) {
        return await this.getCountryDetailsFromAPI(countryCode);
      } else {
        return await this.getCountryDetailsFromDB(countryCode);
      }
    } catch (error) {
      console.error("Error getting country details:", error);
      throw error;
    }
  }

  /* country details from API*/
  async getCountryDetailsFromAPI(countryCode) {
    try {
      const response = await axios.get(`${this.apiUrl}/alpha/${countryCode}`, {
        timeout: 10000,
      });
      return response.data[0];
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /*Get country details from MongoDB */
  async getCountryDetailsFromDB(countryCode) {
    try {
      await connectToDatabase();
      const country = await Country.findOne({
        $or: [
          { cca2: countryCode.toUpperCase() },
          { cca3: countryCode.toUpperCase() },
        ],
      }).lean();

      return country;
    } catch (error) {
      console.error("Error getting country details from DB:", error);
      throw error;
    }
  }

  //   Sort utility function
  sortCountries(countries, sortBy) {
    switch (sortBy) {
      case "capital":
        return countries.sort((a, b) => {
          const capitalA = a.capital?.[0] || "";
          const capitalB = b.capital?.[0] || "";
          return capitalA.localeCompare(capitalB);
        });
      case "currency":
        return countries.sort((a, b) => {
          const currencyA = Object.values(a.currencies || {})[0]?.name || "";
          const currencyB = Object.values(b.currencies || {})[0]?.name || "";
          return currencyA.localeCompare(currencyB);
        });
      case "name":
      default:
        return countries.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
    }
  }
}

const countryServiceObject = new CountryService();
export default countryServiceObject;
