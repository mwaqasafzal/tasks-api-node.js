
module.exports = (res, error) => {
  error.statusCode = error.statusCode || 400
  res.status(error.statusCode).json({
    status: "failed",
    message: error.message
  })
}