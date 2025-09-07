const userData = require("../models/contentModel");

exports.getAllData = async (req,res) => {
  try {
    const data = await userData.find()

      res.status(200).json({
      status: "success",
      result: data.length,
      data
    });
  } catch (error) {
    res.status(400).json({
      status: "failed to get data ",
      message: error.message,
    });
    
  }

}

exports.createData = async (req, res) => {
  try {
    const data = await userData.create(req.body);
    res.status(201).json({
      //   result: data.length,
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed to create ",
      message: error.message,
    });
  }
};
