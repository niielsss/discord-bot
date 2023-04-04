const mongoose = require('mongoose');
const User = require('../models/user.js');

async function findUser(data) {
    return await User.findOne(data);
}

module.exports = { findUser };