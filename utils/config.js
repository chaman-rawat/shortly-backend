require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const ID_LENGTH = process.env.ID_LENGTH;

module.exports = {
  MONGODB_URI,
  PORT,
  ID_LENGTH,
};
