import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    caption:{
        type:String,
        trim:true,
        default:"Krishna Friend"
   

    },
    description:{
        type:String,
        trim:true,
        default:"radhe radhe "
 
    },
    avatar:{
        type:String,
        required:true
 
     
    },
    token:{
        type:String,
        default:null
        
    }
  
 
   
},{timestamps:true});



UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return null;
    this.password=await bcryptjs.hash(this.password,10);
    next();
})


UserSchema.methods.gernerateToken=async function(id){
    console.log(id)
  const token= await  jwt.sign({id},process.env.TOKEN_SECRET);

  return token;
}

UserSchema.methods.isCorrectPassword=function(password){
const decodepassord=bcryptjs.compare(password,this.password);
return decodepassord;
  }
  

export default mongoose.model("newUser",UserSchema);