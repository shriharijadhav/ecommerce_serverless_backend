const jwt = require('jsonwebtoken');

async function checkIfUserIsLoggedIn(req,accessToken,refreshToken, res) {
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                
                // check if refresh token is still valid (not expired)
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(errRefreshToken, decodedRefreshToken) {
                    if (errRefreshToken) {
                        return res.status(200).json({
                            "message": "Failed to verify access token",
                            "isAccessTokenExpired": true,
                            "regenerateAccessToken": true
                        })
                    } else {
                        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
                        req.userId = decodedRefreshToken.userId;
                        req.newAccessToken = newAccessToken
                    }
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

    await checkIfUserIsLoggedIn(req,accessToken,refreshToken,res);

    const newAssessToken = req.newAccessToken
    const userId = req.userId
    return res.status(200).json({
        newAssessToken,
        userId
    });
}
