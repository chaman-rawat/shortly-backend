const express = require("express");
const cors = require("cors");
const app = express();

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const Url = require("../models/url");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("bufferTimeoutMS", 30000);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.get("/:shortID", async (request, response) => {
  const shortId = request.params.shortId;

  const url = await Url.findOne({ short: shortId });

  if (url === null) return response.status(404).send({ error: "Not found" });

  response.redirect(url.full);
});

app.post("/api/:fullUrl", async (request, response) => {
  const fullUrl = request.body.fullUrl;
  console.log("URL requested: ", fullUrl);

  // insert and wait for the record to be inserted using the model
  const url = new Url({ full: fullUrl });

  const savedUrl = await url.save();

  response.status(201).json(savedUrl);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
