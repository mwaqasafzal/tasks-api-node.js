const mongoose = require("mongoose")

const url = "mongodb://127.0.0.1:27017/tasks-api"

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log("Connected to the database")
  })
  .catch(err => {
    console.error(err)
    process.exit();
  })
