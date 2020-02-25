const User = require("./../models/User")
const AppError = require("./../utils/error")
const respondFailure = require("./../utils/failureResponder")

//CRUD to User
exports.newUser = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, 'no user provided')

    let user = new User(req.body)
    user = await user.save()
    res.status(200).json({
      status: "success",
      data: user
    })
  }
  catch (error) {
    respondFailure(res, error)
  }
}

exports.getUser = async (req, res) => {

  try {
    const user = await User.findById(req.params.userId)
    if (!user)
      throw new AppError(404, "user not found")
    res.json({
      status: "success",
      data: user
    })
  }
  catch (error) {
    respondFailure(res, error)
  }

}
exports.getAllUsers = async (req, res) => {

  const users = await User.find({})

  try {
    if (users.length == 0)
      throw new AppError(404, "no user found")

    res.json({
      status: "success",
      data: users
    })
  } catch (error) {
    respondFailure(res, error)
  }


}
exports.updateUser = async (req, res) => {
  try {

    if (Object.keys(req.body).length == 0)
      throw new AppError(400, "no data provided to update")

    let allowedUpdates = ["name", "email", "password"]
    let askedUpdates = Object.keys(req.body)
    let isUpdateAllowed = askedUpdates.every(update => allowedUpdates.includes(update))

    if (!isUpdateAllowed)
      throw new AppError(400, "invalid request for update")

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      runValidators: true
    })

    if (!user)
      throw new AppError(404, "user not found")

    res.json({
      status: "success",
      message: "user updated successfully"
    })

  } catch (error) {
    respondFailure(res, error)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId)
    if (!user)
      throw new AppError(404, 'user not found')
    res.json({
      status: "success",
      message: "user deleted successfully"
    })
  }
  catch (error) {
    respondFailure(res, error)
  }
}

