import checkIfUserIsLoggedIn from '../../middleware/auth';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const blacklistedTokenModel = require('../../model/blacklistedToken');
const dbConnect = require('../../config/dbConnect');



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
        const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);

        if (!isLoggedIn) {
            return res.status(200).json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

        const userId = new mongoose.Types.ObjectId(req.userId);

        const blacklistedToken = await blacklistedTokenModel.create({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userId,
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
