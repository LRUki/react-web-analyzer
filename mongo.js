const mongoose = require("mongoose");
const geoJSON = require("geojson");
mongoose.connect(
  "mongodb+srv://admin-leo:Ryuta6040@cluster0-jgh79.mongodb.net/portfolioDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = class MyWebDB {
  constructor(mongoose, collection) {
    this.schema = new mongoose.Schema(
      {
        _id: String,
        hostname: String,
        city: String,
        region: String,
        country: String,
        loc: String,
        org: String,
        postal: String,
        timezone: String,
        firstVisitTime: String,
        visits: [
          {
            time: String,
            contact: {
              visitorName: String,
              email: String,
              content: String,
            },
          },
        ],
        count: Number,
      },
      { collection: collection }
    );
    this.schema.path("_id").required(true);
    this.schema.path("country").required(true);
    this.schema.path("region").required(true);
    this.schema.path("city").required(true);
    this.schema.path("loc").required(true);
    this.model = new mongoose.model(collection, this.schema);
  }

  async groupByCountry() {
    const data = await this.model.aggregate([
      {
        $match: {
          country: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$country",
          count: {
            $sum: "$count",
          },
          loc: { $first: "$loc" },
        },
      },
    ]);
    const parsedData = parseData("country", data);
    return geoJSON.parse(parsedData, { Point: ["lat", "lng"] });
  }

  async groupByRegion() {
    const data = await this.model.aggregate([
      {
        $match: {
          region: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$region",
          count: {
            $sum: "$count",
          },
          loc: { $first: "$loc" },
        },
      },
    ]);
    const parsedData = parseData("region", data);
    return geoJSON.parse(parsedData, { Point: ["lat", "lng"] });
  }

  async groupByCity() {
    const data = await this.model.aggregate([
      {
        $match: {
          city: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$city",
          count: {
            $sum: "$count",
          },
          loc: { $first: "$loc" },
        },
      },
    ]);
    const parsedData = parseData("city", data);
    return geoJSON.parse(parsedData, { Point: ["lat", "lng"] });
  }

  async read(query, option) {
    console.log("here", option);
    const { sort, size } = option;
    let res;
    if (sort) {
      res = await this.model
        .find(query)
        .sort({ visits: -1 })
        .limit(size ? parseInt(size) : 0);

      return res.filter(
        ({ _id, country, region, city, loc }) =>
          _id && country && region && city && loc
      );
    }
    res = await this.model.find(query).limit(size ? parseInt(size) : 0);
    return res.filter(
      ({ _id, country, region, city, loc }) =>
        _id && country && region && city && loc
    );
  }
};

const parseData = (group, data) => {
  const parsedData = [];
  let sum = 0;
  data.forEach(({ _id, count, loc }) => {
    sum += count;
    const lat = parseFloat(loc.split(",")[0]);
    const lng = parseFloat(loc.split(",")[1]);
    switch (group) {
      case "country":
        parsedData.push({ country: _id, count, lat, lng });
        break;
      case "region":
        parsedData.push({ region: _id, count, lat, lng });
        break;
      case "city":
        parsedData.push({ city: _id, count, lat, lng });
        break;
    }
  });
  return parsedData;
};
