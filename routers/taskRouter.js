const express = require("express")
const taskController = require("./../controllers/taskController")
const Router = express.Router()

Router.route("/")
  .post(taskController.newTask)

Router.route("/:taskId")
  .get(taskController.getTask)
  .delete(taskController.deleteTask)
  .patch(taskController.updateTask)

module.exports = Router