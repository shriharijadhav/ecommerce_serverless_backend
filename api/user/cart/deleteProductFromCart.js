import checkIfUserIsLoggedIn from '../../../middleware/auth';
const dbConnect = require('../../../config/dbConnect');
const cartModel = require('../../../model/cartModel');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token, refresh-token');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Make DB connection
    await dbConnect();

    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];

    if (!accessToken || !refreshToken) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
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

    const { productId } = req.body;
    const userId = req?.userId;

    if (!productId || !userId) {
        return res.status(400).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Product ID or user ID missing in request.',
            isProductDeletedFromCart: false,
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Cart not found for user.',
            isProductDeletedFromCart: false,
        });
    }

    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productId.toString()
    );

    if (!existingProduct) {
        return res.status(404).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Product not found in cart.',
            isProductDeletedFromCart: false,
        });
    }

    const updatedCart = await cartModel.updateOne(
        { user: userId },
        { $pull: { allProductsInCart: { _id: productId } } },
        { new: true }
    );

    return res.status(200).json({
        newAccessToken: req.newAccessToken ? req.newAccessToken : null,
        message: 'Product deleted from cart successfully.',
        isProductDeletedFromCart: true,
    });
}
