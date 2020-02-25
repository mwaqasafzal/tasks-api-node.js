const AppError = require("../utils/error")
const User = require("./../models/User")
const respondFailure = require("../utils/failureResponder")

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      throw new AppError(400, "email or password not provided")

    const user = await User.findOne({ email })

    if (!user)
      throw new AppError(404, "user does not exist")

    let isPassValid = await user.comparePass(password)
    if (!isPassValid)
      throw new AppError(403, "email or password incorrect")

    console.log("logged in successfully")
  }
  catch (error) {
    respondFailure(res, error)
  }

}

exports.signup = async (req, res, next) => {

  try {
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, "missing credentials")

    let user = await User.save(req.body)
  } catch (error) {

  }
}