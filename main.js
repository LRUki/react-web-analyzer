//jshint esversion:6
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const DB = require("./mongo");
mongoose.connect(
  "mongodb+srv://admin-leo:Ryuta6040@cluster0-jgh79.mongodb.net/portfolioDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
let collection = new DB(mongoose, "visits");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  express.json({
    type: "application/json",
  })
);
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

//get request
app.get("/ip", async (req, res) => {
  const { size, sort, ...query } = req.query;
  res.send(await collection.read(query, { size, sort }));
});

app.get("/ip/:area", async (req, res) => {
  let result;
  switch (req.params.area) {
    case "country":
      result = await collection.groupByCountry();
      break;
    case "region":
      result = await collection.groupByRegion();
      break;
    case "city":
      result = await collection.groupByCity();
      break;
    default:
      result = "invalidArgumentError";
  }
  res.send(result);
});
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

var port = process.env.PORT || 5001;
app.listen(port, function () {
  console.log("server running on http://localhost:" + port);
});
