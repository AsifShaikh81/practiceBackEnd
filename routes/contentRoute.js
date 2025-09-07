// global:'app.use('/userdatas',userDataRoute)

const express = require("express");
const router = express.Router();

const contentController = require("./../controllers/contentController");
const authController = require("./../controllers/authController");
router.route("/").get(authController.protectRoute,contentController.getAllData).post(contentController.createData);

module.exports = router;
