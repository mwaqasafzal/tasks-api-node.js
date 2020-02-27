const express = require("express")
const taskController = require("./../controllers/taskController")
const authController=require("./../controllers/authController")
const Router = express.Router()

Router.route("/")
  .post(authController.checkAuthority,taskController.newTask)
  .get(authController.checkAuthority,taskController.getAllTasks)

Router.route("/:taskId")
  .get(authController.checkAuthority,taskController.getTask)
  .delete(authController.checkAuthority,taskController.deleteTask)
  .patch(authController.checkAuthority,taskController.updateTask)

module.exports = Router