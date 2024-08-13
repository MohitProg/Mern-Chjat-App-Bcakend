import Messagemodal from "../Model/Message.modal.js";

import AllMessageModal from "../Model/AllMessage.modal.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import UserModel from "../Model/User.model.js";
import { getReciverSocketId, io } from "../Sokcket/Socket.js";

export const SendMessage = async (req, res) => {
  const senderId = req.userid;
  const recieverId = req.params;


  

  const userDetaills = await UserModel.findById(recieverId?.id);

  const { message } = req.body;
  try {
    const newmessage = new Messagemodal({
      senderId,
      recieverId: recieverId.id,
      message: message,
    });

    await newmessage.save();

    const clientmessageid=getReciverSocketId(recieverId);
    console.log(clientmessageid,"messageid value");
    if(clientmessageid){

      //  io.to.emit is used to send message to specific user 
      console.log(newmessage ,'messageid value')
      io.to(clientmessageid).emit("newmessage",newmessage);
    }

    if (newmessage) {
      const checkinstance = await AllMessageModal.findOne({
        $and: [{ ArrayId: recieverId.id }, { ArrayId: senderId }],
      });

      if (!checkinstance) {
        const saveConversation = new AllMessageModal({
          Author: senderId,
          ArrayId: [senderId, recieverId?.id],
          messageArray: [newmessage._id],
        });

        if (userDetaills) {
          await saveConversation.save();
          const AlldataofUser = {
            userdata: userDetaills,
            messageArray: saveConversation?.messageArray,
          };


          // const clientmessageid=getReciverSocketId(recieverId);
          // if(clientmessageid){

          //   //  io.to.emit is used to send message to specific user 
          //   io.to(clientmessageid).emit("newmessage",message);
          // }
          return res.json(
            new ApiResponse(200, [], "Message added Successfully")
          );


        }
      } else {
        if (checkinstance && userDetaills) {
          const updateMessagearray = await AllMessageModal.findOneAndUpdate(
            { $and: [{ ArrayId: senderId }, { ArrayId: recieverId?.id }] },

            { $addToSet: { messageArray: newmessage } },
            { new: true }
          )
            .populate("ArrayId")
            .populate("messageArray")
            .exec();

          const AlldataofUser = {
            userdata: userDetaills,
            messageArray: updateMessagearray?.messageArray,
          };


          // const clientmessageid=getReciverSocketId(recieverId);
          // console.log(clientmessageid);
          // if(clientmessageid){

          //   //  io.to.emit is used to send message to specific user 
          //   console.log(newmessage)
          //   io.to(clientmessageid).emit("newmessage",newmessage);
          // }

          return res.json(
            new ApiResponse(200, [], "Message added Successfully")
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const EditMessage = (req, res) => {};

export const GetMessage = async (req, res) => {
  const senderId = req.userid;
  const recieverId = req.params;

  try {
    const getConversation = await AllMessageModal.findOne({
      ArrayId: { $all: [recieverId.id, senderId] },
    }).populate("messageArray");

    if (!getConversation) {
      return res.json(new ApiResponse(200, [], "No Message"));
    }

    return res.json(
      new ApiResponse(
        200,
        getConversation.messageArray,
        "Message get succesfully"
      )
    );
  } catch (error) {
    console.log(error);
  }
};

export const ReciverMessagedetail = async (req, res) => {
  const userId = req.userid;
  const reciverId = req.params.id;

  try {
    const userDetaills = await UserModel.findById(reciverId);
   

    const dataOfAllMessage = await AllMessageModal.findOne({
      ArrayId: { $all: [userId, reciverId] },
    })
      .populate("ArrayId")
      .populate("messageArray")
      .exec();

  
    if (userDetaills ) {

      const AlldataofUser = {
        userdata: userDetaills,
        messageArray: dataOfAllMessage!==null?dataOfAllMessage?.messageArray:[],
      };

 

      return res.json(
        new ApiResponse(200, AlldataofUser, "data of all message")
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const DeleteMessage = () => {};
