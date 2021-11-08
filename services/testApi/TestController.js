const router = require('express').Router();
const TestModel = require('./TestModel');
/**
 * api for end point /api/v1/test
 */
router.get('/', async (req, res) => {
    console.log(`reach test controller`);
    const remoteAddress = req.socket.remoteAddress;
    console.log({remoteAddress});
    res.send(`config test router success: foo =  ${process.env.FOO}`);
})

router.get('/nested', async (req, res) => {
    console.log(`reach test nested controller`);
    res.send(`config test nested router success`);
})

router.put('/test-update', async (req, res) => {
    const updateData = req.body;
    console.log(updateData);
    const updated = await TestModel.replaceOne({_id: updateData._id}, updateData);
    res.send('success');
})
router.post('/new', async (req, res) => {
    const testModel = await new TestModel(req.body).save();
    res.send(testModel);

})

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const S3 = require("aws-sdk/clients/s3");
const {uploadFileDefault, getFileStream} = require("../../utils/s3Service");
router.post('/images', upload.single('image') ,async (req, res) => {
    try {
        const file = req.file;
        console.log(file)
        const result = await uploadFileDefault(file);
        console.log({result});
        res.send({key: result.Key});
    } catch (e){
        console.log(e)
        res.status(500).send('fail to upload to S3');
    }

})

router.get("/images/:key", async (req, res) => {
    const imageKey = req.params.key;
    const readStream = getFileStream(imageKey);
    readStream.pipe(res)
})



module.exports = router;