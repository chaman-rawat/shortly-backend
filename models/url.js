const mongoose = require("mongoose");
const nanoid = require("nanoid");
const { ID_LENGTH } = require("../utils/config");

const urlSchema = new mongoose.Schema({
  full: { type: String, required: true },
  short: { type: String, required: true, default: nanoid(ID_LENGTH) },
});

module.exports = mongoose.model("Url", urlSchema);
