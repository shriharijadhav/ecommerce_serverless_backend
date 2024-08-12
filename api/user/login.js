const addressModel = require('../../model/addressModel')
const cartModel = require('../../model/cartModel');
const placedOrderModel = require('../../model/placedOrderModel');

const userModel = require('../../model/userModel')
const dbConnect = require('../../config/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


export default async function login(req, res) {
  
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token, refresh-token'); // Allow specific headers


    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await dbConnect();

    try {
        const {email,password} = req.body;

        // is null or empty string check
        if(!email || !password) {
            return res.status(401).json({
                message:'Some of field are missing. please check',
                isSignupSuccess:false
            })
        }

        // check if user is registered or not 
        const userFromDB = await userModel.findOne({email:email})
        if(!userFromDB){
            return res.status(401).json({
                message:'User is not registered. Please register first',
                isUserAlreadyRegistered:false,
                isLoginSuccessful:false
            })
        }

        // check if password from request matches the hashed password in database
        if (!bcrypt.compareSync(password, userFromDB.password)) {
            return res.status(200).json({
                message:'Password is not matching',
                isPasswordNotMatching:true,
                isLoginSuccessful:false
            })
        }

        
        const payload ={
           userId:userFromDB._id
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });


        // fetch all the data of user from multiple collections and send in response
        const userAddresses = await addressModel.find({ user: userFromDB._id})
        const userCart = await cartModel.findOne({ user: userFromDB._id})
        // Manually populate the 'products' and 'address_id' fields
        const ordersPlaced = await placedOrderModel.findOne({ user: userId })


        const userProfileInfo = {firstName:userFromDB.firstName, lastName:userFromDB.lastName,email:userFromDB.email,contact:userFromDB.contact,userId:userFromDB._id}
        const userData = {
            userProfileInfo,
            userAddresses,
            userCart,
            ordersPlaced,
        }

        return res.status(200).json({
            message:'login successful',
            isLoginSuccessful:true,
            userData,
            accessToken,
            refreshToken
        })
     
    } catch (error) {
        return res.status(200).json({
            error: 'Failed to login ',
            error
        });
    }
}