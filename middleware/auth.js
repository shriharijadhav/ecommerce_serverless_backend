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

module.exports = checkIfUserIsLoggedIn;