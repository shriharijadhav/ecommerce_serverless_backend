const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: "df4prcuev",
  api_key: "412985248428749",
  api_secret: "x00qo_JQnpzYIwlmhGX8X_TuMNk",
});

export default async function handler(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
     
      const form = new formidable.IncomingForm();
    
    //   form.parse(req, async (err, fields, files) => {
    //     if (err) {
    //       return res.status(500).json({ message: 'Error parsing the files' });
    //     }
    
    //     const file = files.file;
    
        try {
           
          return res.status(200).json({
            message: 'File uploaded successfully',
            url: result.secure_url,
          });
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload to Cloudinary', error });
        }
      });
    
    } catch (error) {
        console.log(error)
    }
}
