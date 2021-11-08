const router = require('express').Router();
const s3Service = require('../../utils/s3Service');
const User = require('../user/UserModel');
const multer = require("multer");
const {jwtAuth} = require("../../middlewares");
const upload = multer({dest: 'uploads/'})

const tempImageFile = 'temp/preview-image';


async function getUsernameFromRequest(req) {
    const userId = req.userId;
    const user = await User.findById(userId);
    return user.username;
}

router.get('/picture-preview', async (req, res) => {
    try {
        const username = await getUsernameFromRequest(req);
        const key = `${tempImageFile}/${username}`;
        const fileStream = s3Service.getFileStream(key);
        fileStream.pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send('fail to get file from S3');
    }

})

router.post("/picture-preview",jwtAuth.verifyToken,
    upload.single('image'),
    async (req, res) => {
        try {
            const userName = await getUsernameFromRequest(req);
            const file = req.file;
            const result = await s3Service.uploadFile(file, `${tempImageFile}/${userName}`);
            res.send({key: result.Key});
        } catch (e) {
            console.log(e)
            res.status(500).send('fail to upload to S3');
        }
    })

module.exports = router;