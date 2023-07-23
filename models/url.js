const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  full: { type: String, required: true },
  short: { type: String, required: true },
});

urlSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Url", urlSchema);
