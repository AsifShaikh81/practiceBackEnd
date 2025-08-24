// creating express server
const express = require("express"); //importing module
const fs = require("fs");

const app = express(); // calling module
const dotenv = require("dotenv"); // importing module for config.env

const model = require("./models/model"); //importing model

dotenv.config({ path: "./config.env" }); // defining path to use config.env
app.use(express.json()); // using model

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

//creating databse server
const mongoose = require("mongoose");
const LocalDB = process.env.D_LOCAL;
mongoose.connect(LocalDB, {}).then(() => {
  console.log("local database running");
});

const readfile = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

//iIMPORT DATA
const importData = async () => {
  await model.create(readfile);
  console.log("data loaded");
  process.exit();
};

//DELETE DATA
const deleteData = async () => {
  await model.deleteMany();
  console.log("data deleted");
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
