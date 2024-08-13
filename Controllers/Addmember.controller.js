import AddMemberModal from "../Model/AddMember.modal.js";
import AllMessageModal from "../Model/AllMessage.modal.js";
import MessageModal from "../Model/Message.modal.js";
import UserModel from "../Model/User.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

export const AddMember = async (req, res) => {
  const memberid = req.params;
  const userid = req.userid;


  try {
    if (userid === memberid.id) {
      return res.json(new ApiResponse(404, [], "you cannot add your self"));
    }

   

    const checkuser = await AddMemberModal.findOne({ Author: userid });

    if (!checkuser) {
      const createInstance = new AddMemberModal({
        Author: userid,
        Addedmemberlist: [memberid.id],
      });

      await createInstance.save();

      const updatememberlist = await createInstance.populate("Addedmemberlist");

      return res.json(
        new ApiResponse(
          200,
          updatememberlist?.Addedmemberlist,
          "member added successfully"
        )
      );
    }

    const existuser = await AddMemberModal.findOne({
      Author: userid,
      Addedmemberlist: memberid.id,
    });

    if (existuser) {
      return res.json(new ApiResponse(204, [], "member added already"));
    }

    const updatedDocument = await AddMemberModal.findOneAndUpdate(
      { Author: userid },
      { $addToSet: { Addedmemberlist: memberid?.id } }, // method to add member from array of object
      { new: true } // Returns the modified document
    ).populate("Addedmemberlist");
    


    return res.json(
      new ApiResponse(
        200,
        updatedDocument?.Addedmemberlist,
        "member added successfully"
      )
    );
  } catch (error) {
    console.log(error);
  }
};


export const GetAddedMember = async (req, res) => {
  try {
    const userid = req.userid;

    const memberlist = await AddMemberModal.findOne({
      Author: userid,
    }).populate("Addedmemberlist");

    const data = memberlist !== null ? memberlist?.Addedmemberlist : [];
  

    return res.json(new ApiResponse(200, data, "list of added member"));
  } catch (error) {
    console.log(error);
  }
};

export const DeleteMember = async (req, res) => {
  try {
    const memberid = req.params;
    const userid = req.userid;

    const RemoveUser = await AddMemberModal.findOneAndUpdate(
      { Author: userid },
      { $pull: { Addedmemberlist: memberid.id } }, // new method to remove element from object array value
      { new: true }
    ).populate("Addedmemberlist");

   
    if (RemoveUser) {
      const DeleteChat = await AllMessageModal.findOneAndDelete({
        ArrayId: [userid, memberid?.id]
      });
      console.log(DeleteChat)
      if (DeleteChat==null || DeleteChat) {
        const Deletemessage = await MessageModal.deleteMany({ $and: [{ recieverId: memberid.id }, { senderId: userid }] });


        const data = RemoveUser?.Addedmemberlist;

      

        return res.json(new ApiResponse(200, data, "user and its data remove "));
      }
    }

    

  } catch (error) {
    console.log(error);
  }
};


