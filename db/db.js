import mongoose from "mongoose";

export const database=async()=>{
    try {
       const res= await mongoose.connect(process.env.MONGO_URL);

       console.log(`data base is connected successfull `)
    } catch (error) {
        console.log("connection issue ",error.message);
        
    }

}
