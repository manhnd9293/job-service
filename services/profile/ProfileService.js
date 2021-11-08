const Profile = require("./ProfileModel");
const ProfileService = {
    async createProfile(userId) {
        return await new Profile({userId}).save();
    }
}

module.exports = ProfileService;