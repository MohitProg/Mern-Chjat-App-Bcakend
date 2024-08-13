import { Router } from "express"
import { DeleteMessage, EditMessage, GetMessage, SendMessage,ReciverMessagedetail } from "../Controllers/Message.controller.js";
import { AuthCheck } from "../Middleware/Auth.js";

const route=Router();

route.delete("/deletemessage",AuthCheck,DeleteMessage)
route.put("/editmessage/:id",AuthCheck,EditMessage)
route.post("/sendmessage/:id",AuthCheck,SendMessage)
route.get("/getmessage/:id",AuthCheck,GetMessage);
route.get("/user-message/:id",AuthCheck,ReciverMessagedetail);
export default route;