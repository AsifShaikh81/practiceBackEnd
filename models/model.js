const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema1 = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    // required: [true, "name required"],
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
  password: {
    type: String,
    required: [true, "pass req"],
    select: false,
    select: false,
    minlength: [8, "min length is 8"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "passConf req"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

// hashing pssword before saving doc in data base
schema1.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});


// comparing both hashed password for verification
// schema1.methods.correctPassword = async function (userpass, DBpass) {
  //   return await bcrypt.compare(userpass, DBpass);
  // };
  
  schema1.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  const model = mongoose.model("model", schema1);
module.exports = model; // exporting module to controllers folder
