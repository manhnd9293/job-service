const User = require("./UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ProfileService = require("../profile/ProfileService");

function UserResponse(id, username, firstname, lastname, roles, accessToken, avatarUrl) {
    return {id, username, firstname, lastname, roles, accessToken, avatarUrl}
}


const UserService = {
    async register(username, password, firstname, lastname) {
        if (username.length < 6) {
            throw new Error("Username is too short") ;
        }

        if (username.length > 12) {
            throw new Error("Username is too long");
        }

        if (password.length < 6) {
            throw new Error("Invalid password length");
        }

        const checkUserExist = await User.findOne({username});
        if (checkUserExist) {
            throw Error("username existed");
        }
        const userInfo = {username,password: bcrypt.hashSync(password, 8), firstname, lastname};
        const savedUser = await new User(userInfo).save();
        await ProfileService.createProfile(savedUser.id);
        const accessToken = this.createToken(savedUser._id);

        return new UserResponse(savedUser._id, savedUser.username, savedUser.firstname, savedUser.lastname, savedUser.roles, accessToken);
    },

    async login(username, password) {
        const user = await User.findOne({ username: username });
        if (!user) {
            throw Error("User not found");
        }
        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            throw Error("Invalid user name or password");
        }
        console.log(`secret jwt:`);
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPRIRE // 24 hours
        });

        return new UserResponse(user._id, user.username, user.firstname, user.lastname ,user.roles, token, user.avatarUrl);
    },

    async getUserInfoFromToken(userId, token) {
        const user = await User.findOne({ _id: userId });
        return new UserResponse(user._id, user.username, user.firstname, user.lastname, user.roles, token, user.avatarUrl);
    },

    createToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPRIRE // 24 hours
        });
    }
}

module.exports = UserService;