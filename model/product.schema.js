const mongoose = require('../database/db');
const Schema = mongoose.Schema;

var product_schema = new Schema({
    product_name: {
        type: String,
        maxlength: [30, "product_name cannot exceed 30 charactor"],
        min: [4, "product_name should be more than 4 charactor"],
        unique: true
    },
    description: {
        type: String,
        maxlength: [50, "description cannot exceed 50 charactor"],
    },
    price: {
        type: Number,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    rating: {
        type:Number,
        default:1
    },
    stock: {
        type: Number
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "please enter your category Id"],
        strictPopulate: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', product_schema);
module.exports = Product;