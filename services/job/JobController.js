const {Job} = require("./JobModel");
const {jwtAuth} = require("../../middlewares");
const router = require('express').Router();
/**
 * get job posted by userId
 */
router.get('/', async (req, res) => {
    try {
        const {userId} = req;
        const job = await Job.find({createdByUserId: userId});
        res.status(200).json(job);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get job")
    }
})

/**
 * create job post
 */
router.post('/',jwtAuth.verifyToken, async (req, res) => {
    try {
        const {userId} = req;
        const job = req.body;
        job.createdByUserId = userId;
        const savedJob = await new Job(job).save();
        res.status(200).send(savedJob);
    } catch (e) {
        console.log(e)
        res.status(500).send("Fail to get job")
    }
})

module.exports = router;