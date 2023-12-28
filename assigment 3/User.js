const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect("mongodb+srv://esha:esha1234@cluster0.zamuvee.mongodb.net/?retryWrites=true&w=majority")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (plainText, callback) {
    // return this.password==plainText;
    console.log(plainText);
    console.log(this.password);
    return bcrypt.compareSync(plainText, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;  const express = require('express');