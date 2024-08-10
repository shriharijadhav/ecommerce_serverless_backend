const jwt = require('jsonwebtoken');
const blacklistedTokenModel = require('../model/blacklistedToken');
const mongoose = require('mongoose');

async function checkIfUserIsLoggedIn(req, accessToken, refreshToken) {
    try {
        // Validate the refresh token first
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.userId = decodedRefreshToken.userId;

        // Check if the tokens are blacklisted
        const blacklistedToken = await blacklistedTokenModel.findOne({
            user: new mongoose.Types.ObjectId(req.userId),
            accessToken,
            refreshToken
        });

        if (blacklistedToken) {
            return false; // Tokens are blacklisted
        }

        try {
            // Validate the access token
            const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.userId = decodedAccessToken.userId;
            return true; // Access token is valid
        } catch (err) {
            if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
                // Access token is expired or invalid, but refresh token is still valid
                const payload = { userId: decodedRefreshToken.userId };
                const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
                req.newAccessToken = newAccessToken;
                return true; // New access token generated
            }
            throw new Error('Invalid access token'); // Unknown error with access token
        }
    } catch (err) {
        // Handle refresh token errors or blacklisting errors
        console.error('Token verification failed:', err.message);
        return false; // Invalid or expired refresh token, or blacklisted tokens
    }
}

module.exports = checkIfUserIsLoggedIn;
