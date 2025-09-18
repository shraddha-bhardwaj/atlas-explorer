import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";

class CountryRepository {
  async findCountries(filter, sort, skip, limit, select) {
    return await Country.find(filter)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countDocuments(filter = {}) {
    return await Country.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return await Country.aggregate(pipeline);
  }

  async distinct(field, filter = {}) {
    return await Country.distinct(field, filter);
  }

  async findOne(filter, select = null) {
    const query = Country.findOne(filter);
    if (select) {
      query.select(select);
    }
    return await query.lean();
  }

  async insertMany(documents) {
    return await Country.insertMany(documents);
  }

  async findWithLimit(filter, select, limit) {
    return await Country.find(filter).select(select).limit(limit).lean();
  }
}

const countryRepository = new CountryRepository();
export default countryRepository;
