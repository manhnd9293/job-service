const mongoose = require('mongoose');

const Company = mongoose.model("Company",
   new mongoose.Schema({
       name: {type: String, required: true, unique: true},
       size: {type: String, required: true},
       industry: {type: String, required: true},
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

module.exports = Company 