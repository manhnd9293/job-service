const {Job, JobPostStatus} = require("./JobModel");
const {jwtAuth} = require("../../middlewares");
const router = require('express').Router();
/**
 * get job posted by userId
 */
router.get('/',jwtAuth.verifyToken, async (req, res) => {
    try {
        const {userId} = req;
        const job = await Job.find({createdByUserId: userId})
            .populate({path: 'companyId', select: 'name logoVersion'} );
        res.status(200).json(job);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get job")
    }
})
/**
 * get job posting review
 */
router.get('/review/:id', jwtAuth.verifyToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req;
        const job = await Job.findById(id).lean();

        if (job.createdByUserId.toString() !== userId) {
            res.status(400).send('Invalid userId');
        }

        if (job.status !== JobPostStatus.Pending) {
            res.status(400).send('Invalid job review');
        }
        res.status(200).json(job);
    } catch (e) {
        console.log(e);
        res.status(500).send(`fail to get job review`);
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
        res.status(200).send(savedJob._id);
    } catch (e) {
        console.log(e)
        res.status(500).send("Fail to get job")
    }
})

/**
 * publish job
 */
router.put('/', jwtAuth.verifyToken, async (req, res) => {
    try {
        const {jobId} = req.body;
        const job = await Job.findById(jobId);
        job.status = JobPostStatus.Posted;
        const saved = await job.save();
        res.status(200).send(`post success`);
    } catch (e) {
        console.log(e);
        res.status(500).json(`Fail to publish job`);
    }
})
module.exports = router;