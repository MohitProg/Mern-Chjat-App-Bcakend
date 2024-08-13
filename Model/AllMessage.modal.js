import mongoose from "mongoose";

const allmessageSchema = new mongoose.Schema({
  Author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "newUser",
  },
  ArrayId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newUser",
      default:[]
    },
  ],
  messageArray: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserMessage",
    default:[]
  }],
});


export default mongoose.model("Allmessage",allmessageSchema);