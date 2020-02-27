const express = require("express")
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")
const router = express.Router()

router.route("/")
  .post(authController.checkAuthority,userController.newUser)//only possible for admin->will be checking in router handler
  
router.route("/me")
  .get(authController.checkAuthority,userController.getUser)
  .patch(authController.checkAuthority,userController.updateUser)
  .delete(authController.checkAuthority,userController.deleteUser)

router.post("/login", authController.login)
router.post("/signup", authController.signup)

module.exports = router