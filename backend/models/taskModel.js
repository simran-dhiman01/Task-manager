import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:''
    },
    priority:{
        type:String,
        enum:['Low','High','Medium'],
        default:'Low'
    },
    dueDate:{
        type:Date
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const Task = mongoose.model('Task',taskSchema);