const express = require("express")
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")
const Router = express.Router()
Router.route("/")
  .post(userController.newUser)

Router.post("/login", authController.login)
Router.post("/signup", authController.signup)
Router.route("/:userId")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = Router