const model = require("../models/model"); //importing model for databse

const express = require("express");
const app = express();
app.use(express.json());

exports.getAllUsers = async (req, res) => {
  try {
    const user1 = await model.find(); // get all users

    res.status(200).json({
      status: "success",
      result: user1.length,
      data: {
        user1,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user3 = await model.findById(req.params.ID); // get user by id

    res.status(200).json({
      status: "success",
      result: user3.length,
      data: {
        user3,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user2 = await model.create(req.body); // create user
    res.status(201).json({
      status: "success",
      result: user2.length,
      data: {
        user2,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const user4 = await model.findByIdAndUpdate(req.params.ID, req.body, {
      new: true,
      runValidators: true,
    }); // update user
    res.status(202).json({
      status: "success",
      result: user4.length,
      data: {
        user4,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const user5 = await model.findByIdAndDelete(req.params.ID) // delete user
    res.status(204).json({
      status: "success",
      result: user5.length,
      data: {
        user5,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
  }
};
