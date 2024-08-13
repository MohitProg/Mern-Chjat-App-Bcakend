import jwt from "jsonwebtoken"

export const AuthCheck=async(req,res,next)=>{


    try {
        const token = req.cookies.token;
       
    
        if(!token){
            return res.json("Invalid credentials of token not found");
        }
        

        const decode = jwt.verify(token,process.env.TOKEN_SECRET);
       

        req.userid=decode.id;
        next()
    } catch (error) {
        console.log(error)
    }

}