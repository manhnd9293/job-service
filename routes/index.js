const router = require('express').Router();
const TestController = require('../services/testApi/TestController')
const CourseController = require('../services/course/CourseController')
const UserController = require('../services/user/UserController')
const CommonController = require('../services/common/CommonController')
const reviewController = require("../services/review/ReviewController");
const {jwtAuth} = require("../middlewares");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use("/api/v1/test", TestController);
router.use("/api/v1/course", CourseController);
router.use("/api/v1/user", UserController);
router.use("/api/v1/common", CommonController);
router.use("/api/v1/review", reviewController);

module.exports = router;
