const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:[true,"task must have an owner"],
    ref:'User'
  }
},{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})


taskSchema.methods.toJSON=function(){
  const task=this
  taskClone=task.toObject()
  delete taskClone['owner']
  delete taskClone['__v']
  return taskClone
}

module.exports = mongoose.model('Task', taskSchema)