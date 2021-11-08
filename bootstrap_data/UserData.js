const User = require('../services/user/UserModel');

const user1 = {
    username: "manhnd",
    password: "123123",
};

const user2 = {
    username: "manhnd1",
    password: "123123",
};

const user3 = {
    username: "manhnd2",
    password: "123123",
};

function insertInitialUser() {
    User.insertMany([user1, user2, user3]).then((docs) => {
        console.log(`insert all initial user`);
        return docs;
    })
}

module.exports = {insertInitialUser};