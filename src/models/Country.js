import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    name: {
      common: { type: String, required: true },
      official: { type: String, required: true },
    },
    cca2: { type: String, required: true, unique: true },
    cca3: { type: String, required: true, unique: true },
    capital: [{ type: String }],
    region: { type: String, index: true },
    population: { type: Number },
    area: { type: Number },
    flags: {
      png: { type: String },
      svg: { type: String },
      alt: { type: String },
    },
    currencies: {
      type: Map,
      of: {
        name: String,
        symbol: String,
      },
    },
    languages: {
      type: Map,
      of: String,
    },
    timezones: [{ type: String }],
    continents: [{ type: String }],
    latlng: [{ type: Number }],
    capitalInfo: {
      latlng: [Number],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Country ||
  mongoose.model("Country", CountrySchema);
