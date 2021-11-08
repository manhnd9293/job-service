const mongoose = require('mongoose');

const Company = mongoose.model("Company",
   new mongoose.Schema({
       name: {type: String, required: true, unique: true},
       size: {type: String, required: true},
       industry: {type: String, required: true},
       address: {type: String, required: true},
       description: {type: String, required: true},
       logo: {type: String},
       backDrop: {type: String},
       photos: {
           type: [{
               s3Key: {type:String, required: true}
           }],
           default: []
       }
   })
)

module.exports = Company