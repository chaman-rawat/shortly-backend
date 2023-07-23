const express = require("express");
const cors = require("cors");
const app = express();

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const Url = require("./models/url");
const { nanoid } = require("nanoid");

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

app.use(middleware.requestLogger);

app.post("/api", async (request, response) => {
  const fullUrl = request.body.url;
  if (fullUrl === undefined)
    return response.status(400).json({ error: "request must have url" });

  const currentUrl = `${request.protocol}://${request.hostname}/`;
  const url = new Url({
    full: fullUrl,
    short: nanoid(config.ID_LENGTH),
  });

  await url.save();

  response
    .status(201)
    .json({ full: url.full, short: `${currentUrl}${url.short}` });
});

app.get("/:shortId", async (request, response) => {
  const shortId = request.params.shortId;

  const url = await Url.findOne({ short: shortId });

  if (url === null) return response.status(404).send({ error: "Not found" });

  console.log(url);
  response.redirect(url.full);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
