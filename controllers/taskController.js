const Task = require("./../models/Task")
const AppError = require("./../utils/error")
const respondFailure = require("./../utils/failureResponder")

//CRUD to Task
exports.newTask = async (req, res) => {

  try {
    if (Object.keys(req.body).length == 0)
      throw new AppError(400, 'no task provided')
    
    let task = new Task({...req.body,owner:req.user._id})

    task = await task.save()
    await task.populate("owner","-_id name email").execPopulate()
    res.status(201).json({
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
    const task = await Task.findOne({_id:req.params.taskId,owner:req.user._id})
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

exports.getAllTasks=async(req,res)=>{
  try {
    const queryAllowed=["completed","sort","skip","limit"]
    const queryAttributes=Object.keys(req.query)
    let isQueryAllowed=queryAttributes.every(attr=>queryAllowed.includes(attr))
    if(!isQueryAllowed)
      throw new AppError(400,"invalid query string")
    
      //filtering
    let match={}
    if(req.query.completed)
      match.completed=req.query.completed==="true"
    
    const query=Task.find({owner:req.user._id,...match})  
    //pagging
    if(req.query.limit){
      let skip=req.query.skip*1||0
      query.skip(skip*req.query.limit)
      query.limit(parseInt(req.query.limit))
    }
    
    //sorting
    if(req.query.sort){
      let sort={}//will carry sorting options
      let sortData=req.query.sort.split(",")//it will be like "-completed,description"
      sortData.forEach(sortItem=>{
        if(sortItem.startsWith('-'))
          sort[sortItem.slice(1)]=-1//will remove the - sign with attribute to sort
        else
          sort[sortItem]=1
      })
      query.sort(sort)
    }

    //executing the query
    const tasks=await query.exec()   
    res.json({
      status:"success",
      data:tasks
    })
  } catch (error) {
    respondFailure(res,error)    
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
    
    const task = await Task.findOneAndUpdate({_id:req.params.taskId,owner:req.user._id},req.body,{runValidators:true})

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
    const task = await Task.findOneAndDelete({_id:req.params.taskId,owner:req.user._id})

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

