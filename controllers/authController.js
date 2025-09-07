const model = require("../models/model");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { Model } = require("mongoose");

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

exports.protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "u are not loged in" });
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  const currentUser = await model.findById(decode.id);
  if (!currentUser) {
    return res
      .status(401)
      .json({ message: "user belongs to this token no longer exist" });
  }
  req.user = currentUser;
  next();
};

exports.forgotPassword = async (req, res) => {
  const user = await model.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: "no user with this email" });
  }
  // 2) generate the random reset token
  const resetToken = user.createPassResToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const reseturl = `${req.protocol}://${req.get(
    "host"
  )}/asif/resetPassword/${resetToken}`;

  const message = `forgot ur pass? submit patch req and pass confirm to: ${reseturl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your pass reset token(valid for 10)",
      message,
    });

    res.status(200).json({ status: "success", message: "token sent to email" });
  } catch (error) {
    console.error("ERROR SENDING EMAIL:", error);

    (user.passResetToken = undefined),
      (user.passResetExpires = undefined),
      await user.save({ validateBeforeSave: false });
    return res.status(401).json({ message: "error sending email " });
  }
};

// ----------------reset password=====================

exports.resetPassword = async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await model.findOne({
    passResetToken: hashedToken,
    passResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // saved after modifying

  //3) Update changed PasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
};

exports.updatePassword = async (req, res) => {
  // 1) Get user from collection
  const user = await model.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  // 3) If so, update password
  // pass from db = pass that user entering
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // saving updated pass in database

  // User.findByIdAndUpdate will NOT work as intended!
  // 4) Log user in, send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
};
