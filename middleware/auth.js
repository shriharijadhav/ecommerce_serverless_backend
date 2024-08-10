const jwt = require('jsonwebtoken');
const blacklistedTokenModel = require('../model/blacklistedToken');
const mongoose = require('mongoose');

async function checkIfUserIsLoggedIn(req, accessToken, refreshToken) {
    try {
        // Log the start time
        console.time('checkIfUserIsLoggedIn');

        // Check if the refresh token is valid first
        const decodedRefreshToken_demo = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId_temp = new mongoose.Types.ObjectId(decodedRefreshToken_demo.userId);

        if(decodedRefreshToken_demo){
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
                const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
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
