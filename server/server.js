// creating express server
const express = require("express"); //importing module

const app = express(); // calling module
const dotenv = require("dotenv"); // importing module for config.env
const morgan = require('morgan')

dotenv.config({ path: "./config.env" }); // defining path to use config.env
app.use(express.json()); // using model
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log('morgan enabled in dev mode');
    
    
}

const userRoute = require('../routes/route.js') // importing routes 
app.use('/asif', userRoute)

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
