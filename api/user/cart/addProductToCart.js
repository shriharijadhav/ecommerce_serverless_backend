import checkIfUserIsLoggedIn from '../../../middleware/auth';
const dbConnect = require('../../../config/dbConnect');
const cartModel = require('../../../model/cartModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token, refresh-token'); // Allow specific headers
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
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductAddedToCart: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
    if (!isLoggedIn) {
        return res.status(200).json({
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductAddedToCart: false,
        });
    }

    // Logic for adding product to cart starts here
    const { productFromRequest } = req.body;
    const userId = req?.userId;
    const cartId = req?.completeUserDetails?.userCart?._id;

    if (!productFromRequest || !userId || !cartId) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Either productFromRequest, user id or cart is missing in request.',
            isProductAddedToCart: false,
            cartId,
            productFromRequest,
            userId
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Cart not found for user with id ' + userId,
            isProductAddedToCart: false,
        });
    }

    // Check if the product already exists in the cart
    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productFromRequest._id.toString()
    );
    
    let updatedCart;
    if (!existingProduct) {  // Changed condition to check if existingProduct is undefined
        // Case 1: Product is added to cart for the first time
        let newProduct = {
            ...productFromRequest,
            quantity: 1,
        };
        updatedCart = await cartModel.updateOne(
            { user: userId },
            { $push: { allProductsInCart: newProduct } },
            { new: true }
        );
    } else {
        // Case 2: Product already exists in the cart, increase quantity by 1
        updatedCart = await cartModel.updateOne(
            { user: userId, 'allProductsInCart._id': existingProduct._id },
            { $inc: { 'allProductsInCart.$.quantity': 1 } },
            { new: true }
        );
    }
    
    return res.status(200).json({
        newAccessToken: req.newAccessToken ? req.newAccessToken : null,
        message: 'Product added to cart successfully.',
        isProductAddedToCart: true,
        
    });
}
