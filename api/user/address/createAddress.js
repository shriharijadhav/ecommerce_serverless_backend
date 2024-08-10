const jwt = require('jsonwebtoken');

async function checkIfUserIsLoggedIn(req,accessToken,refreshToken, res) {
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decodedAccessToken) {
            if (err) {
                
                // check if refresh token is still valid (not expired)
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(errRefreshToken, decodedRefreshToken) {
                    if (errRefreshToken) {
                        return res.status(200).json({
                            "message": "Session time out. Refresh token expired",
                            "isRefreshTokenExpired": true,
                            "redirectUserToLogin": true
                        })
                    } else {
                        // added user add on req
                        req.userId = decodedRefreshToken.userId;

                        // re-generate new access token and add key on req
                        const payload ={
                            userId:decodedRefreshToken.userId
                         }
                        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
                        req.newAccessToken = newAccessToken
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

export default async function handler(req, res) {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({
            message: 'Access token is required'
        });
    }

    await checkIfUserIsLoggedIn(req,accessToken,refreshToken,res);


    const newAccessToken = req.newAccessToken
    const userId = req.userId
    return res.status(200).json({
        newAccessToken,
        userId
    });
}
