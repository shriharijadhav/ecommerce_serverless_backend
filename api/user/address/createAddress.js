import checkIfUserIsLoggedIn from '../../../middleware/auth';

const jwt = require('jsonwebtoken');


export default async function handler(req, res) {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({
            message: 'Access token is required'
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);

        if (!isLoggedIn) {
            return res.status(200).json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                redirectUserToLogin: true,
            });
    }



    let isNewAccessTokenGenerated = false;
    if(req.newAccessToken){
        isNewAccessTokenGenerated=true;
    }
    const userId = req.userId
    return res.status(200).json({
        newAccessToken:isNewAccessTokenGenerated? req.newAccessToken : null,
        userId
    });
}
