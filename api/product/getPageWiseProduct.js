import checkIfUserIsLoggedIn from '../../middleware/auth';

const dbConnect = require('../../config/dbConnect');
const productModel = require('../../../model/productModel');

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
            redirectUserToLogin: true,
            pageWiseProductFetch: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
    if (!isLoggedIn) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
        });
    }

    const { page = 1, gender, category } = req.body; // Default to page 1 if not provided
    const limit = 15; // Number of products per page
    const skip = (page - 1) * limit;

    try {
        // Build the query object with filters
        let query = {};
        if (gender) {
            query.gender = gender;
        }
        if (category) {
            query.category = category;
        }

        // Fetch products with pagination and filters
        const products = await productModel.find(query)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination purposes
        const totalProducts = await productModel.countDocuments(query);

        return res.status(200).json({
            message: 'Products fetched successfully',
            page,
            totalPages: Math.ceil(totalProducts / limit),
            products,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching products',
            error: error.message,
        });
    }
}
