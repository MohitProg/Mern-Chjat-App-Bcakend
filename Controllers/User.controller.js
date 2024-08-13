import UserModel from "../Model/User.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { UploadCloudinary } from "../Utils/Cloudinary.js";

export const SigninUser = async (req, res) => {



  try {
    const { name, email, password } = req.body;
    if (!name) {
      return new ApiResponse(404, [], "please enter your name");
    }
    if (!email) {
      return new ApiResponse(404, [], "please enter your email");
    }
    if (!password) {
      return new ApiResponse(404, [], "please enter your password");
    }
    if (req.file===undefined) {
      return res.json(new ApiResponse(404, [], "please upload a image  "));
    }
    const checkexituser = await UserModel.findOne({
      $or: [{ name }, { email }],
    });

    if (checkexituser) {
      return res.json(new ApiResponse(404, [], "User already exist "));
    }

  

    const avatar = await UploadCloudinary(req.file.path);

    const newUser = new UserModel({
      name,
      email,
      password,
      avatar: avatar.url,

    });

    const saveuser = await newUser.save();

    return res.json(new ApiResponse(200, saveuser, "User Save  Successfully "));
  } catch (error) {
    console.log(error);
    return res.send({msg:"internal server error"})
  }
};

export const LoginUser = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email) {
      return new ApiResponse(404, [], "please enter your email");
    }
    if (!password) {
      return new ApiResponse(404, [], "please enter your password");
    }

    const checkexituser = await UserModel.findOne({ email });

    if (!checkexituser) {
      return res.json(new ApiResponse(404, [], " Invalid Credientials "));
    }

    const ispassword = await checkexituser.isCorrectPassword(password);
    if (!ispassword) {
      return res.json(new ApiResponse(404, [], " password is incorrect "));
    }

    const token = await checkexituser.gernerateToken(checkexituser._id);
   

    if (!token) {
      return res.json(new ApiResponse(404, [], "Invalid Credentials"));
    }

    checkexituser.token=token;
    checkexituser.save({ validateBeforeSave: false });
    

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure:true,
        expires:new Date(Date.now()+25892000000)
      })
      .json(new ApiResponse(200, checkexituser, "User login Successfully"));
  } catch (error) {
    console.log(error);
  }
};


export const getUser=async(req,res)=>{
const userid=req.userid;

try {
  const getuser=await UserModel.findOne({_id:userid});


    return res.json(new ApiResponse(200,getuser,"getting user data"));

  
} catch (error) {
  console.log(error)
}
}


export const UpdateUser = async (req,res) => {


    const id=req.userid;
try {
    const {name,description,caption,email}=req.body;
 if(req.file!==undefined){

    const updateimagepath=await UploadCloudinary(req.file.path);
const Updateduser=await UserModel.findByIdAndUpdate(id,{
    name,
    email,
    caption,description,avatar:updateimagepath.url,
  
},  {new:true}).select("-password");


return res.json(new ApiResponse(200, Updateduser,"User update Successfully"));
 }else{

     const Updateduser=await UserModel.findByIdAndUpdate(id,{
        name,
        email,
        caption,description
    },{new:true}).select("-password");

    
    return res.json(new ApiResponse(200,Updateduser, "User update Successfully"));
 }


} catch (error) {
    console.log(error);
}
};


export const  logout=async(req,res)=>{
    const id=req.userid;
try {

    const checkuser= await UserModel.findById(id);
 

    checkuser.token="";
    checkuser.save({ validateBeforeSave: false });
    return     res.clearCookie('token').json(new ApiResponse(200,[],"Logout successfully"))
} catch (error) {
    console.log(error);
}
}


export const getAlluser=async(req,res)=>{
  const userId=req.userid;
 
  try {
    const alluseraccount=await UserModel.find(
      { _id: { $nin: [userId] } } // method to exclue one member from find and get all member data 
    ).select("-password");
    return res.json(new ApiResponse(200,alluseraccount, "All user data"));

  } catch (error) {
    console.log(error)
  }
}

// export const getSpecificuserdata=async(req,res)=>{
//   const id=req.params.id;
 
//   try {
//     const singleuserdata=await UserModel.findById(id).select("-password")
//     return res.json(new ApiResponse(200,singleuserdata, "single user data"));

//   } catch (error) {
//     console.log(error)
//   }
// }
export const DeleteUser = () => {};
