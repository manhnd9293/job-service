const router = require('express').Router();
const TestController = require('../services/testApi/TestController')
const UserController = require('../services/user/UserController')
const CompanyController = require('../services/company/CompanyController')

const {jwtAuth} = require("../middlewares");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use("/api/v1/test", TestController);
router.use("/api/v1/user", UserController);
router.use("/api/v1/company", CompanyController);


module.exports = router;
