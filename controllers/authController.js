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
    
    const token=await user.getJWTToken()
    res.json({
      status:"success",
      jwt:token
    })  
  }
  catch (error) {
    respondFailure(res, error)
  }

}

exports.signup = async (req, res, next) => {

  try {
    let user={}
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, "missing credentials")

    let allowedCredentials=["name","email","password","confirmPassword"]
    allowedCredentials.forEach(credential=>user[credential]=req.body[credential])
    user=new User(user)
    
    await user.save()
    const token=await user.getJWTToken()
    res.json({
      status:"success",
      jwt:token
    }) 

  } catch (error) {
    respondFailure(res,error)
  }
}


exports.checkAuthority=async (req,res,next)=>{

  const authkeys=req.headers.authorization.split(" ")
  try {
    if(authkeys[0].toLowerCase()!=="bearer")
      throw new AppError(402,"unauthorized to access,Login First")
    
      //validateToken returns the user if found otherwise it will throw an exception
    const user=await User.validateToken(authkeys[1])
    req.user=user

    next()
  } catch (error) {
    respondFailure(res,error)
  }
  
}