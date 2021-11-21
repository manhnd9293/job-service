const mongoose = require('mongoose');

function connectDb() {
    // const dbUrlLocal = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
    // const dbUrlCloud = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    // const dbUrlCloud = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

    if (process.env.NODE_ENV !== 'product') {
        mongoose.set('debug', true);
    }

    console.log(`Start connect to db url: ${process.env.DB_URL} ....`);
    return mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log(`Connect database successfully `)
            if (process.env.DROP_DB === "true") {
                mongoose.connection.db.dropDatabase().then(() => {
                    console.log("Drop current Db");
                });
            }
        })

        .catch((err) => {
            console.error("Fail to connect to database", err);
            process.exit();
        });

}

module.exports = {connectDb}
