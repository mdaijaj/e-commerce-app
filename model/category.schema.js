const mongoose = require('../database/db');
const Schema = mongoose.Schema;

var category_schema = new Schema({
    category_name: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', category_schema);
module.exports = Category;