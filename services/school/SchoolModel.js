const mongoose = require('mongoose');

const School = mongoose.model("School",
    new mongoose.Schema({
        name: {type: String, required: true, unique: true},
        address: {type: String, required: true},
        description: {type: String, required: true},
        logoVersion: {type: Number},
        backdropVersion: {type: Number},
        photos: {
            type: [{
                createTime: {type: Date, default: Date.now()}
            }],
            default: []
        },
        createdByUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    })
)

module.exports = School