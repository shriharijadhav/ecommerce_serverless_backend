import checkIfUserIsLoggedIn from '../../middleware/auth';

const dbConnect = require('../../config/dbConnect');
const placedOrderModel = require('../../model/placedOrderModel');
const cartModel = require('../../model/cartModel');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-token'); // Allow specific headers
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
            isOrderPlacedSuccessfully: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);
    if (!isLoggedIn) {
        return res.status(200).json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isOrderPlacedSuccessfully: false,
        });
    }

    // Fetch userId from middleware (assuming it's set after authentication)
    const userId = req.userId;

    try {
        // Get allProductsInCart from the cart collection based on the user ID
        const cart = await cartModel.findOne({ user: userId });

        if (!cart || cart.allProductsInCart.length === 0) {
            return res.status(400).json({
                message: 'Your cart is empty. Please add items to your cart before placing an order.',
                isOrderPlacedSuccessfully: false,
            });
        }

        const { address_id, contact_number } = req.body;

        if (!address_id || !contact_number) {
            return res.status(400).json({
                message: 'address_id and contact_number are required',
                isOrderPlacedSuccessfully: false,
            });
        }

        // Create a new placed order
        const placedOrder = new placedOrderModel({
            user: userId,
            products: cart.allProductsInCart, // Use the allProductsInCart from the cart
            address_id,
            contact_number,
        });

        const orderPlaced = await placedOrder.save();

        if (!orderPlaced) {
            return res.status(500).json({
                message: 'Failed to place order. Please try again',
                isOrderPlacedSuccessfully: false,
            });
        }

        // Clear the allProductsInCart array in the cart without deleting the cart document
        await cartModel.updateOne(
            { user: userId },
            { $set: { allProductsInCart: [] } }
        );

        return res.status(201).json({
            message: 'Order placed successfully',
            orderId: placedOrder._id,
            isOrderPlacedSuccessfully: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while placing the order',
            error: error.message,
        });
    }
}
