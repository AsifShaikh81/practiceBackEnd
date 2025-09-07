const mongoose = require("mongoose");

const schema2 = new mongoose.Schema({
  ifsc: {
    type: Number,
    required: [true, "ifsc code is requires"],
  },
  address: {
    type: String,
    required: [true, "address is require"],
  },
  phoneNo: {
    type: Number,
    required: [true, "phone no is require"],
  },
});

const userData = mongoose.model("userData", schema2);
module.exports = userData;
//  const model = mongoose.model("model", schema1);
