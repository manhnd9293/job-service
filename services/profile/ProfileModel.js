const mongoose = require('mongoose');
const baseModelProp = require("../../common/baseModelProp");

const Profile = mongoose.model(
    "Profile",
    new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        firstname: String,
        lastname: String,
        dateOfBirth: {type: Date, default: null},
        enrolledCourseList: [
            {
                courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
                courseName: {type: String},
                completedLessons: [
                    {
                        lessonId: {type: mongoose.Schema.Types.ObjectId, ref: "Lesson"},
                        lessonName: {type: String}
                    }
                ]
            }
        ],
        ...baseModelProp,
    })
)

module.exports = Profile