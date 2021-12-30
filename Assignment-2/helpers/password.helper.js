'use strict';
const bcrypt = require('bcryptjs');

/** match password */
const matchPassword = async (userPassword, dbPassword) => {
    let result = await bcrypt.compare(userPassword, dbPassword);
    return result;
}

module.exports = {
    matchPassword
}
