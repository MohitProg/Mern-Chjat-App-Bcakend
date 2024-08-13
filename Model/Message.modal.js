import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser"
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser"
    },
    message:{
        type:String,
        trim:true,
        required:true,
       
    }
},{timestamps:true})

export  default mongoose.model("UserMessage",messageSchema);