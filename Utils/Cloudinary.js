import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'



    cloudinary.config({ 
        cloud_name: 'dmd35imtv', 
        api_key: '424113654613344', 
        api_secret: 'QNgrda51__CmmPxvCX-315R7cU0' 
    });


 async function UploadCloudinary(filepath){

    try {
        const uploadResult = await cloudinary.uploader
        .upload(
            filepath, {
               resource_type:"auto"
            }
        )
        .catch((error) => {
            console.log(error);
        });

        fs.unlinkSync(filepath);
        console.log(uploadResult.url)

        return uploadResult;
     

    } catch (error) {
        console.log(error)
    }
    
    }
    
    export {UploadCloudinary}
      
