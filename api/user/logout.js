const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const blacklistedTokenModel = require('../../model/blacklistedToken');
const dbConnect = require('../../config/dbConnect');

function checkIfUserIsLoggedIn(req, accessToken, refreshToken) {
    try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedAccessToken.userId;
        return true; // Access token is valid
    } catch (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                req.userId = decodedRefreshToken.userId;

                // re-generate new access token and add key on req
                const payload ={
                    userId:decodedRefreshToken.userId
                 }
                const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
                req.newAccessToken = newAccessToken
                return true; // Refresh token is valid
                
            } catch (errRefreshToken) {
                // Refresh token is also invalid or expired
                return false;
            }
        }
        throw new Error('Invalid token');
    }
}

export default async function logout(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await dbConnect();

    try {
        const { accessToken, refreshToken } = req.body;
        const isLoggedIn = checkIfUserIsLoggedIn(req, accessToken, refreshToken);

        if (!isLoggedIn) {
            return res.status(200).json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

        const userId = mongoose.Types.ObjectId(req.userId);

        const blacklistedToken = await blacklistedTokenModel.create({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userId,
        });

        if (blacklistedToken) {
            return res.status(200).json({
                message: 'User logged out successfully',
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to logout',
            details: error.message,
        });
    }
}
