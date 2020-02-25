const express = require("express")
require("./connectDb")
const userRouter = require("./routers/userRouter")
const taskRouter = require("./routers/taskRouter")

const app = express()

//configuring express application
const PORT = process.env.PORT || 3000
app.use(express.json())

//ROUTING
app.use('/api/user', userRouter)
app.use('/api/task', taskRouter)


// app.use((error, req, res, next) => {
//   console.log("in global error handler")
//   console.log(error)
// })

app.listen(PORT, () => {
  console.log(`Application Started at port ${PORT}`)
})