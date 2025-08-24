const mongoose = require("mongoose");

const schema1 = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
    trim: true,
  },
  age: {
    type: Number,
    // required:[true,'name required'],
  },
  role: {
    type: String,
    required: [true, "role required"],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, "salary required"],
  },
});

const model = mongoose.model('model',schema1);

module.exports = model; // exporting module to controllers folder
