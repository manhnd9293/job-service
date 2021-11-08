const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const TestModel = mongoose.model(
    "Test",
    new Schema({
        name: String,
        age: Number,
    })
)

module.exports =  TestModel