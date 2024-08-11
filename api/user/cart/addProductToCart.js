// import checkIfUserIsLoggedIn from '../../../middleware/auth';
// const dbConnect = require('../../../config/dbConnect')
// const cartModel = require('../../../model/cartModel');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');


// export default async function handler(req, res) {

//     // Set CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token, refresh-token'); // Allow specific headers
//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//         return res.status(200).end();
//     }

//     // make db connection
//     await dbConnect();


//     const accessToken = req.headers['access-token'];
//     const refreshToken = req.headers['refresh-token'];

//     if (!accessToken || !refreshToken) {
//         return res.status(200).json({
//             message: 'Tokens missing',
//             redirectUserToLogin: true,
//             isAddressSaved:false

//         });
//     }

//     const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
//     if (!isLoggedIn) {
//             return res.status(200).json({
//                 message: "Session timeout. Refresh token expired",
//                 isRefreshTokenExpired: true,
//                 redirectUserToLogin: true,
//                 isAddressSaved:false

//             });
//     }

//     // logic for creating address starts here
//     const {houseAddress,street,city,state,postalCode,country,phoneNumber} = req.body;

//     if(!houseAddress || !street || !city || !state || !postalCode || !country || !phoneNumber) {
//         return res.status(200).json({
//             newAccessToken:req.newAccessToken ? req.newAccessToken : null,
//             message:'Some of the fields are missing',
//             isAddressSaved:false
//         });
//     }

//     let userId = req?.userId;

//     const allAddresses = await addressModel.find({user:userId});

//     let savedAddress;
//     // check if at least one address has been added already - if not, create a new one and set isDefault property to true
//     if(allAddresses.length===0) {
//         savedAddress = await addressModel.create({houseAddress,street,city,state,postalCode,country,phoneNumber,isDefault:true,user:userId})
//     }else{
//         savedAddress = await addressModel.create({houseAddress,street,city,state,postalCode,country,phoneNumber,user:userId})
//     }

     

//     // logic for creating address ends here   
    
    
//     return res.status(200).json({
//         newAccessToken:req.newAccessToken ? req.newAccessToken : null,
//         message:savedAddress?'Address saved successfully':'Failed to save address. Please try again.',
//         savedAddress,
//         isAddressSaved:true,
//         completeUserDetails:req?.completeUserDetails ? req?.completeUserDetails : null
//     });
// }
