const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    price: Number,
    id: Number,
    image_url: String,
    rating: String,
    style: String,
    description: String,
    total_reviews: Number,
    availability: String
});

module.exports = mongoose.models[process.env.productTable] || mongoose.model(process.env.productTable, productSchema);