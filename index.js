import dotenv from "dotenv";
dotenv.config();
import express from "express"
import { database } from "./db/db.js";
import cors from "cors"
import userRoutes from "./Routes/User.routes.js"
import cookieParser from "cookie-parser";
import AddmemberRoutes from "./Routes/AddMember.routes.js"
import MessageRoutes from "./Routes/Message.routes.js"
import { app, server } from "./Sokcket/Socket.js";

const PORT=process.env.PORT||3000;


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
   
    credentials:true
}))

//  route 
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/user/member",AddmemberRoutes);
app.use("/api/v1/user/message",MessageRoutes);



database().then(()=>{
    server.listen(PORT,()=>{
        console.log(`server is runnig at port no ${PORT}`)
    })
    
}).catch((error)=>{
    console.log(error.message)
})



