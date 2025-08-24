const express = require("express");
const router = express.Router();

const controll = require("../controllers/controller"); // importing controllers

router.route("/").get(controll.getAllUsers).post(controll.createUser);
router
  .route("/:ID")
  .get(controll.getUserById)
  .patch(controll.updateUsers)
  .delete(controll.deleteUsers);

module.exports = router; // exporting to server.js file
