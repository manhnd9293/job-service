const mongoose = require('mongoose')
const baseModelProp = {
    createdTime: {type: Date, default: Date.now},
    updatedTime: {type: Date, default: null},
    isDeleted: {type: Date, default: null},
    deletedTime: {type: Date, default: null},
    createdByUserId: {type: mongoose.Schema.Types.ObjectId}
}

module.exports = baseModelProp