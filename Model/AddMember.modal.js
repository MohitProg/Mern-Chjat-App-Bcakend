import mongoose, { Mongoose } from "mongoose"
const AddmemberSchema= new mongoose.Schema({
    Author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser"
    },
    Addedmemberlist:[{
             type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        default:[]
    }]
},{timestamps:true})

export default  mongoose.model("userAddedMember",AddmemberSchema);