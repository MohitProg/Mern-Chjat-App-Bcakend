import { Router } from "express";
import { AddMember, DeleteMember, GetAddedMember } from "../Controllers/Addmember.controller.js";
import { AuthCheck } from "../Middleware/Auth.js";

const route=Router();
route.post("/addmember/:id",AuthCheck,AddMember);
route.delete("/deletemember/:id",AuthCheck,DeleteMember);
route.get("/getaddedmember",AuthCheck,GetAddedMember);


export default route;


