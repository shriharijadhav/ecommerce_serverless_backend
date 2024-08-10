const jwt = require('jsonwebtoken');

async function checkIfUserIsLoggedIn(accessToken, res) {
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return res.status(200).json({
                    message: 'Failed to verify access token',
                    isAccessTokenExpired: true,
                    regenerateAccessToken: true
                });
            } else {
                return res.status(200).json({
                    decoded: decoded
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export default async function handler(req, res) {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({
            message: 'Access token is required'
        });
    }

    await checkIfUserIsLoggedIn(accessToken, res);
}
