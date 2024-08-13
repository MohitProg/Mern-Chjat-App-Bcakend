import { Router } from "express";
import { upload } from "../Middleware/Multer.middleware.js";
import { DeleteUser, getAlluser, getUser, LoginUser, logout, SigninUser, UpdateUser } from "../Controllers/User.controller.js";
import { AuthCheck } from "../Middleware/Auth.js";
const route=Router();

route.post("/signin",upload.single("avatar"),SigninUser);
route.post("/login",LoginUser)
route.get("/userdata",AuthCheck,getUser)
route.put("/update",AuthCheck,upload.single("avatar"),UpdateUser)
route.delete("/delete",AuthCheck,DeleteUser);
route.get("/logout",AuthCheck,logout);
route.get("/getalluser",AuthCheck,getAlluser);



export default route;