const {jwtAuth} = require("../../middlewares");

const {Industry, CompanySize, City} = require("../company/CompanyEnums");
const Company = require("../company/CompanyModel");
const router = require("express").Router();


router.patch('/company',jwtAuth.verifyToken, async (req, res) => {
    console.log('Done');
    const list = await Company.find({})
        .update({$set: {industry: Industry.Software, size: CompanySize.MORE_THAN_TWO_TS, city: City.Hanoi}});
    res.status(200).json('Migrate success');
})

module.exports = router;