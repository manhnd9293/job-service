const mongoose = require('mongoose');
const Role = require("./Role");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {type: String, required: true, minlength: 6, maxlength: 12},
        password: {type: String, required: true},
        roles: {type: [String], default: [Role.Student]},
        avatarUrl: {type: String},
        email: {type:String},
        firstname: {type: String},
        lastname: {type: String}
    })
)

module.exports = User