'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    registerType: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

/** encrypt user password */
UserSchema.pre('save', function (next) {
    if (!this.password) {
        return;
    }
    // encrypt password
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

/** match password */
UserSchema.methods.matchPassword = function (userPassword) {
    let result = bcrypt.compareSync(userPassword, this.password);
    return result;
}

/** generate token */
UserSchema.methods.generateToken = function () {
    let token = jwt.sign({
        _id: this._id,
        email: this.email,
        registerType: this.registerType
    }, process.env.JWT_SECRET_KEY);
    return token;
}

module.exports = mongoose.model('User', UserSchema);
