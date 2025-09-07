// globa route /asif

const express = require("express");
const router = express.Router();

const controll = require("../controllers/controller"); // importing controllers
const authController = require("./../controllers/authController");
//*==============================auth==========================
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router
  .route("/updatePassword")
  .patch(authController.protectRoute, authController.updatePassword);
//*==============================auth==========================
// router.route('/updateme').patch(authController.protectRoute,controll.updateMe)
router.route("/").get(controll.getAllUsers).post(controll.createUser);
router.route("/get-stats").get(controll.getAvgSalary);
router.route("/get-all-name-salary/:NAME").get(controll.getAllName);

router
  .route("/:ID")
  .get(controll.getUserById)
  .patch(controll.updateUsers)
  .delete(controll.deleteUsers);

module.exports = router; // exporting to server.js file
