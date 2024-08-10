const addressModel = require('../../../model/addressModel')
const jwt = require('jsonwebtoken')

async function checkIfUserIsLoggedIn(accessToken) {
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return res.status(200).json({
                    message:'failed to verify access token',
                    isAccessTokenExpired: true,
                    regenerateAccessToken:true
                })
            }else{
               return res.status(200).json({
                "decoded": decoded
               }) 
            }
          });
    } catch (error) {
        
    }
}

export default async function handler(req,res){
    const {accessToken, refreshToken} = req.body
    await checkIfUserIsLoggedIn(accessToken);
}