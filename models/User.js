const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const AppError = require("./../utils/error")

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
  }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    this.confirmPassword = undefined
  }
  next()
})
userSchema.methods.comparePass = async function (password) {
  console.log(this)
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)