const userModel = require('../../model/userModel')
const dbConnect = require('../../config/dbConnect');
const blacklistedTokenModel = require('../../model/blacklistedToken')
const mongoose = require('mongoose');

async function checkIfUserIsLoggedIn(req,accessToken,refreshToken, res) {
    try {

        


        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decodedAccessToken) {
            if (err) {
                
                // check if refresh token is still valid (not expired)
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(errRefreshToken, decodedRefreshToken) {
                    if (errRefreshToken) {
                        return res.status(200).json({
                            message: "Session time out. Refresh token expired",
                            isRefreshTokenExpired: true,
                            isUserLoggedOut: true,
                            redirectUserToLogin: true
                        })
                    } else {
                        // added user add on req
                        req.userId = decodedRefreshToken.userId;

                        // in case of logout we do not want to regenerate the new access token
                    }
                });

            } else {
                req.userId = decodedAccessToken.userId;
                
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}


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
        const {accessToken, refreshToken} = req.body;
        await checkIfUserIsLoggedIn(req,accessToken,refreshToken,res);
        

        const userId = mongoose.Types.ObjectId(req.userId);

        const blacklistedToken = await blacklistedTokenModel.create({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userId
        })


        if(blacklistedToken){
            return res.status(200).json({
                message: 'User logged out successfully',
                isUserLoggedOut: true,
                redirectUserToLogin: true,

            })
        }




    } catch (error) {
        return res.status(200).json({
            error: 'Failed to login ',
        });
    }
}