import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    name: {
      common: { type: String, required: true, index: true },
      official: { type: String, required: true },
    },
    cca2: { type: String, required: true, unique: true },
    cca3: { type: String, required: true, unique: true },
    capital: [{ type: String }],
    region: { type: String, index: true },
    subregion: { type: String },
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
    borders: [{ type: String }],
    timezones: [{ type: String }],
    continents: [{ type: String, index: true }],
    latlng: [{ type: Number }],
    landlocked: { type: Boolean },
    independent: { type: Boolean },
    unMember: { type: Boolean },
    coatOfArms: {
      png: String,
      svg: String,
    },
    car: {
      signs: [String],
      side: String,
    },
    fifa: String,
    gini: {
      type: Map,
      of: Number,
    },
    idd: {
      root: String,
      suffixes: [String],
    },
    startOfWeek: String,
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
