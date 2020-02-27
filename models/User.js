const AppError = require("./../utils/error")
const Task=require("./Task")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")

const SECRET="lets write an amazing web technology in node.js,my favourite"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error("invalid email provided")
    }
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new AppError(400, 'password cannot have the word "password"')
    }
  },
  confirmPassword: {
    type: String,
    required: true,
    validate(value) {
      if (this.password != value)
        throw new AppError(400, "password confirmation does not match with password")
    }
  },
  type:{
    type:String,
    enum:['admin','user'],
    default:'user'
  },
  passwordChangedAt:{
    type:Date
  }
},{
  timestamps:true,
  toJSON:{
    virtuals:true
  },
  toObject:{
    virtuals:true
  }  
})

userSchema.virtual("tasks",{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.passwordChangedAt=new Date()
    this.password = await bcrypt.hash(this.password, 10)
    this.confirmPassword = undefined
  }
  
  next()
})

userSchema.pre('remove',async function(next){
  const user=this
  await Task.deleteMany({owner:user._id})
  next()
})

userSchema.methods.comparePass = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.getJWTToken=async function(){
  return await jwt.sign({id:this._id.toString()},SECRET,{expiresIn:"1 day"})
}

userSchema.methods.toJSON=function(){
  const user=this
  const userClone=user.toObject()
  
  delete userClone['password']
  delete userClone['__v']
  delete userClone['passwordChangedAt']
  delete userClone['_id']
  delete userClone['type']
  
  return userClone
}

userSchema.statics.validateToken=async function(token){
  //1-checking the validity of token
    const userData=jwt.verify(token,SECRET)
  //2-checking either user still exists from the data obtained from token
    const user=await User.findById(userData.id)
    if(!user)
      throw new AppError(404,"user not found,create a new account")
  //3-checking if the password is changed after that token in generated,if yes then
      //user has to login again
    if(userData.iat<Date.parse(user.passwordChangedAt)/1000)
      throw new AppError(402,"unauthorized to access,Login First")
    
    return user
}
const User=mongoose.model('User', userSchema)
module.exports = User