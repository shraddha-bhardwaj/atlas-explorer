import axios from "axios";
import countryRepository from "@/repositories/CountryRepository";
import { connectToDatabase } from "@/lib/mongodb";
import { throwError, tryAsync } from "@/utils/apiError";

class CountryService {
  constructor() {
    this.apiUrl =
      process.env.REST_COUNTRIES_API_URL || "https://restcountries.com/v3.1";
    this.useApiDataSource = process.env.USE_API_DATA_SOURCE === "true";

    if (!this.useApiDataSource) {
      this.initializeDatabase();
    }
  }

  async initializeDatabase() {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error(
        "CountryService: Failed to connect to MongoDB:",
        error.message
      );
      console.log("Falling back to external API");
      this.useApiDataSource = true;
    }
  }

  /* Fetch all countries from the REST API */
  async fetchAllCountriesFromAPI() {
    return await tryAsync(async () => {
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
    }, "Failed to fetch countries from API");
  }

  /* Populate MongoDB with countries data from API */
  async populateDatabase() {
    return await tryAsync(async () => {
      const existingCountries = await countryRepository.countDocuments();
      if (existingCountries > 0) {
        console.log(
          `Database already contains ${existingCountries} countries.`
        );
        return {
          message: `Database already populated with ${existingCountries} countries`,
          count: existingCountries,
        };
      }

      console.log("Fetching countries data from API");
      const countriesData = await this.fetchAllCountriesFromAPI();

      console.log(`Inserting ${countriesData.length} countries into DB`);
      await countryRepository.insertMany(countriesData);

      console.log("Database population completed successfully");
      return {
        message: "Database populated successfully",
        count: countriesData.length,
      };
    }, "Database population failed");
  }

  /* Search countries with filters and options */
  async searchCountries(
    query = "",
    continent = "",
    page = 1,
    limit = 12,
    sortBy = "name"
  ) {
    return await tryAsync(async () => {
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
    }, "Country search failed");
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
      throwError(error, "API search failed");
    }
  }

  /* Search countries from MongoDB */
  async searchCountriesFromDB(query, continent, page, limit, sortBy) {
    return await tryAsync(async () => {
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

      const skip = (page - 1) * limit;
      const select =
        "name cca2 cca3 capital region subregion population flags currencies continents";

      const pipeline = [
        { $match: filter },
        {
          $facet: {
            results: [
              { $sort: sort },
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 0,
                  name: 1,
                  cca2: 1,
                  cca3: 1,
                  capital: 1,
                  region: 1,
                  subregion: 1,
                  population: 1,
                  flags: 1,
                  currencies: 1,
                  continents: 1,
                },
              },
            ],

            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const [result] = await countryRepository.aggregate(pipeline);
      const countries = result.results;
      const totalCount = result.totalCount[0]?.count || 0;

      return {
        countries,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
    }, "Database search failed");
  }

  /*Get all continents*/
  async getContinents() {
    return await tryAsync(async () => {
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
        const continents = await countryRepository.distinct("continents");
        return continents.sort();
      }
    }, "Failed to fetch continents");
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
      throwError(error, "Failed to get country suggestions");
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

      throwError(error, "Failed to fetch suggestions from API");
    }
  }

  /*suggestions from MongoDB*/
  async getCountrySuggestionsFromDB(query, continent, limit) {
    return await tryAsync(async () => {
      let filter = {
        $or: [
          { "name.common": { $regex: query, $options: "i" } },
          { "name.official": { $regex: query, $options: "i" } },
        ],
      };

      if (continent) {
        filter.continents = continent;
      }

      const pipeline = [
        { $match: filter },
        {
          $project: {
            _id: 0,
            name: "$name.common",
            official: "$name.official",
          },
        },
        { $limit: limit },
      ];

      return await countryRepository.aggregate(pipeline);
    }, "Database suggestions failed");
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
      throwError(error, "Failed to get country details");
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

      throwError(error, "Failed to fetch country details from API");
    }
  }

  /*Get country details from MongoDB */
  async getCountryDetailsFromDB(countryCode) {
    try {
      const filter = {
        $or: [
          { cca2: countryCode.toUpperCase() },
          { cca3: countryCode.toUpperCase() },
        ],
      };

      return await countryRepository.findOne(filter);
    } catch (error) {
      console.error("Error getting country details from DB:", error);
      throwError(error, "Database query failed");
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
