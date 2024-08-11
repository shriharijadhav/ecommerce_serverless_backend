import checkIfUserIsLoggedIn from '../../middleware/auth';

const dbConnect = require('../../config/dbConnect');
const productModel = require('../../model/productModel');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Make db connection
    await dbConnect();
    
    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];

    if (!accessToken || !refreshToken) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Tokens missing',
            singleProductFetchSuccessful: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
    if (!isLoggedIn) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            singleProductFetchSuccessful: false,
        });
    }

    const { landingPageUrl } = req.body;

    if (!landingPageUrl) {
        return res.status(400).json({
            message: 'landingPageUrl is required',
            singleProductFetchSuccessful: false,
        });
    }

    try {
        // Fetch the first product with the given landingPageUrl
        const product = await productModel.findOne({ landingPageUrl });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                singleProductFetchSuccessful: false,
            });
        }

        return res.status(200).json({
            message: 'Product fetched successfully',
            singleProductFetchSuccessful: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching product',
            error: error.message,
        });
    }
}
