const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    landingPageUrl: { type: String, required: true },
    loyaltyPointsEnabled: { type: Boolean, default: false },
    adId: { type: String, default: "" },
    isPLA: { type: Boolean, default: false },
    productId: { type: Number, required: true },
    product: { type: String, required: true },
    productName: { type: String, required: true },
    rating: { type: Number, required: true },
    ratingCount: { type: Number, required: true },
    isFastFashion: { type: Boolean, default: false },
    futureDiscountedPrice: { type: Number, default: 0 },
    futureDiscountStartDate: { type: String, default: "" },
    discount: { type: Number, required: true },
    brand: { type: String, required: true },
    searchImage: { type: String, required: true },
    effectiveDiscountPercentageAfterTax: { type: String, default: "0" },
    effectiveDiscountAmountAfterTax: { type: Number, default: 0 },
    buyButtonWinnerSkuId: { type: Number, required: true },
    buyButtonWinnerSellerPartnerId: { type: Number, required: true },
    relatedStylesCount: { type: Number, default: 0 },
    relatedStylesType: { type: String, default: "" },
    productVideos: { type: [String], default: [] },
    inventoryInfo: [{
        skuId: { type: Number, required: true },
        label: { type: String, required: true },
        inventory: { type: Number, required: true },
        available: { type: Boolean, required: true },
    }],
    sizes: { type: String, required: true },
    images: [{
        view: { type: String, required: true },
        src: { type: String, required: true },
    }],
    gender: { type: String, required: true },
    primaryColour: { type: String, required: true },
    discountLabel: { type: String, default: "" },
    discountDisplayLabel: { type: String, default: "" },
    additionalInfo: { type: String, default: "" },
    category: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    advanceOrderTag: { type: String, default: "" },
    colorVariantAvailable: { type: Boolean, default: false },
    productimagetag: { type: String, default: "" },
    listViews: { type: Number, default: 0 },
    discountType: { type: String, default: "" },
    tdBxGyText: { type: String, default: "" },
    catalogDate: { type: Date, required: true },
    season: { type: String, required: true },
    year: { type: Number, required: true },
    isPersonalised: { type: Boolean, default: false },
    eorsPicksTag: { type: String, default: "" },
    personalizedCoupon: { type: String, default: "" },
    personalizedCouponValue: { type: Number, default: 0 },
    productMeta: { type: String, default: "" },
    systemAttributes: [{
        attribute: { type: String, required: true },
        value: { type: String, required: true },
    }],
    attributeTagsPriorityList: { type: [String], default: [] },
    preferredDeliveryTag: { type: String, default: "" },
});

const productModel =  mongoose.model('product', productSchema);
module.exports = productModel
