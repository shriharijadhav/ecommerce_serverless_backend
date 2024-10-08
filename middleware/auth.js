const jwt = require('jsonwebtoken');
const blacklistedTokenModel = require('../model/blacklistedToken');
const mongoose = require('mongoose');
const dbConnect = require('../config/dbConnect');
const userModel = require('../model/userModel');
const addressModel = require('../model/addressModel');
const cartModel = require('../model/cartModel');

async function checkIfUserIsLoggedIn(req, accessToken, refreshToken) {
    try {
        // Log the start time
        await dbConnect();

        const decodedRefreshToken_demo = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId_temp = decodedRefreshToken_demo?.userId;

        // check if user with id exists in database or not
        let userFoundInDB = await userModel.findOne({_id: userId_temp});
        if (!userFoundInDB) {
            return false
        }else{
            const userAddresses = await addressModel.find({ user: userFoundInDB._id})
            const userCart = await cartModel.findOne({ user: userFoundInDB._id})
            const userProfileInfo = {
                firstName:userFoundInDB.firstName,
                lastName:userFoundInDB.lastName,
                email:userFoundInDB.email,
                contact:userFoundInDB.contact,
                userId:userFoundInDB._id}
            const userData = {
                userProfileInfo,
                userAddresses,
                userCart
            }
            req.completeUserDetails = userData
        }

        if (decodedRefreshToken_demo) {
            // Check if the tokens are blacklisted
            const blacklistedToken = await blacklistedTokenModel.findOne({
                user: userId_temp,
                accessToken: accessToken,
                refreshToken: refreshToken
            });


            if (blacklistedToken) {
                
                return false; // Tokens are blacklisted
            }
        }

        // Verify the access token
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedAccessToken.userId;

        console.timeEnd('checkIfUserIsLoggedIn');
        return true; // Access token is valid

    } catch (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                req.userId = decodedRefreshToken.userId;

                // Re-generate new access token
                const payload = { userId: decodedRefreshToken.userId };
                const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
                req.newAccessToken = newAccessToken;

                return true; // Refresh token is valid

            } catch (errRefreshToken) {
                return false; // Refresh token is invalid or expired
            }
        }
        return false; // Access and refresh tokens are both invalid
    }
}

module.exports = checkIfUserIsLoggedIn;
