const Task = require("./../models/Task")
const AppError = require("./../utils/error")

const respondFailure = require("./../utils/failureResponder")

//CRUD to Task
exports.newTask = async (req, res) => {

  try {
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, 'no task provided')

    let task = new Task(req.body)

    task = await task.save()
    res.status(200).json({
      status: "success",
      data: task
    })
  }
  catch (error) {
    respondFailure(res, error)
  }
}

exports.getTask = async (req, res) => {

  try {
    const task = await Task.findById(req.params.taskId)
    if (!task)
      throw new AppError(404, "task not found")
    res.json({
      status: "success",
      data: task
    })
  }
  catch (error) {
    respondFailure(res, error)
  }

}


exports.updateTask = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, "no data provided to update")

    let allowedUpdates = ["description", "completed"]
    let askedUpdates = Object.keys(req.body)
    let isUpdateAllowed = askedUpdates.every(update => allowedUpdates.includes(update))

    if (!isUpdateAllowed)
      throw new AppError(400, "invalid request for update")

    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      runValidators: true
    })

    if (!task)
      throw new AppError(404, "task not found")

    res.json({
      status: "success",
      message: "task updated successfully"
    })

  } catch (error) {
    respondFailure(res, error)
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId)
    if (!task)
      throw new AppError(404, 'task not found')
    res.json({
      status: "success",
      message: "task deleted successfully"
    })
  }
  catch (error) {
    respondFailure(res, error)
  }
}

