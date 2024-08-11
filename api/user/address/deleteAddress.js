import checkIfUserIsLoggedIn from '../../../middleware/auth';
import addressModel from '../../../model/addressModel';
const dbConnect = require('../../../config/dbConnect')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


export default async function handler(req, res) {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token, refresh-token'); // Allow specific headers
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // make db connection
    await dbConnect();


    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];

    if (!accessToken || !refreshToken) {
        return res.status(200).json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isAddressDeleted:false
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
    if (!isLoggedIn) {
            return res.status(200).json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                redirectUserToLogin: true,
                isAddressDeleted:false
            });
    }

    // logic for deleting address starts here
    const {addressId} = req.body;
    let userId = req?.userId;
    if(!addressId || !userId) {
        return res.status(200).json({
            newAccessToken:req.newAccessToken ? req.newAccessToken : null,
            message:'Failed to delete Address.Address ID and User ID is required to delete a address.',
            isAddressDeleted:false
        });
    }

    const deletedAddress = await addressModel.deleteOne({ _id: addressId, user: userId });
   

    // logic for deleting address ends here   
    
    
    return res.status(200).json({
        newAccessToken:req.newAccessToken ? req.newAccessToken : null,
        message:deletedAddress?'Address deleted successfully':'failed to delete the address with id'+addressId,
        isAddressDeleted:true
    });
}
