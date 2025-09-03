const express = require("express");
const router = express.Router();

const controll = require("../controllers/controller"); // importing controllers
const authController = require('./../controllers/authController')

router.route("/").get(controll.getAllUsers).post(controll.createUser);
router.route("/get-stats").get(controll.getAvgSalary);
router.route("/get-all-name-salary/:NAME").get(controll.getAllName);

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.logIn)

router
  .route("/:ID")
  .get(controll.getUserById)
  .patch(controll.updateUsers)
  .delete(controll.deleteUsers);

module.exports = router; // exporting to server.js file
