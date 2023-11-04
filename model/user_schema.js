const mongoose = require('../database/db');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const Schema = mongoose.Schema;

var signup_schema = new Schema({
    first_name: {
        type: String,
        maxlength: [30, "first_name cannot exceed 30 charactor"],
        min: [4, "first_name should be more than 4 charactor"]
    },
    last_name: {
        type: String,
        maxlength: [30, "last_name cannot exceed 30 charactor"],
        min: [4, "last_name should be more than 4 charactor"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "please enter valid email id"]
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum : ['user','admin'],
        default: "user",
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    }
}, 
{
    timestamps: true
});


//hashing password
signup_schema.pre("save", async function (next) {
    console.log("Hi i am pre password using...")
    if (this.isModified('password')) {
        console.log("password modified...")
        this.password = await Bcrypt.hash(this.password, 12)
    }
    next()
})


//using jwt generate token
signup_schema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ id: this._id }, process.env.Secret || "aijajkhan", { expiresIn: "10 min" });
        return token;
    }
    catch (err) {
        console.log("not token verify", err.message)
    }
}


const User = mongoose.model('User', signup_schema);
module.exports = User;