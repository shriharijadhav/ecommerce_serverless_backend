const userModel = require('../../model/userModel')
const dbConnect = require('../../config/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


export default async function login(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

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
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '180s' });

        return res.status(200).json({
            message:'login successful',
            isLoginSuccessful:true,
            accessToken,
            refreshToken
        })
     
    } catch (error) {
        return res.status(200).json({
            error: 'Failed to login ',
        });
    }
}