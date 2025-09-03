const model = require("../models/model");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const userSignUp = await model.create({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    role: req.body.role,
    salary: req.body.salary,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: userSignUp._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
    data: userSignUp,
  });
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const userLogIn = await model.findOne({ email }).select("+password");

  if (
    !userLogIn ||
    !(await userLogIn.correctPassword(password, userLogIn.password))
  ) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const token = jwt.sign({ id: userLogIn._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
    data: userLogIn,
  });
};
