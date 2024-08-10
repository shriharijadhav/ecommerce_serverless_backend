const userModel = require('../models/userModel');
const dbConnect = require('../config/dbConnect');
const bcrypt = require('bcrypt');


export default async function handler(req, res) {
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await dbConnect();

    try{

        const {firstName,lastName,email,password,contact} = req.body;

        // is null check
        if(!firstName || !lastName || !email || !password || !contact) {
            return res.status(401).json({
                message:'Some of field are missing. please check',
                isSignupSuccess:false
            })
        }

        // check if the user is already registered
        const userFromDB = await userModel.findOne({email:email})
        if(userFromDB){
            return res.status(401).json({
                message:'User already registered. please login',
                isUserAlreadyRegistered:true,
                isSignupSuccess:false
            })
        }

        // hash the password before inserting data into the database
        let hashedPassword=null;
        bcrypt.hash(password, 10, function(err, hash) {
            if(err) {
                return res.status(500).json({
                    message:'Failed to hash password',
                    isSignupSuccess:false,
                })
            }
            else{
                hashedPassword = hash
            }
        });

        const savedUser = await userModel.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashedPassword,
            contact:contact
            
        })

        if(!savedUser){
            return res.status(500).json({
                message:'Failed to register user. please try again',
                isSignupSuccess:false,
            })
        }

        return res.status(200).json({
            message:'User registered successfully',
            isSignupSuccess:true,
        })
       


    } catch (error) {
        return res.status(500).json({
            error: 'Failed to update todos',
        });
    }
}