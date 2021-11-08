const fs = require("fs");
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');


function envConfig() {
    console.log(`configure app for running in ${process.env.NODE_ENV} environment`);
    if (process.env.NODE_ENV !== 'product') {
        const envConfig = dotenv.config();
        dotenvExpand(envConfig);
        // require('dotenv').config({path: `../.env.${process.env.NODE_ENV}`});
    }
}

module.exports = {envConfig}