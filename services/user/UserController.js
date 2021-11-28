const UserService = require("./UserService");
const ResponseStatus = require("../../common/ResponseStatus");
const router = require('express').Router();
const User = require("./UserModel");
const {verifyToken} = require("../../middlewares/jwtAuth");
const multer = require("multer");
const {uploadFile, getFileStream, s3} = require("../../utils/s3Service");
const upload = multer({dest: 'tempAva/'})
const {unlink} = require('fs/promises');


router.get('/all', async (req, res) =>{
    try {
        const allUser =  await User.find({}).skip(3).limit(1);

        return res.status(200).send(allUser);
    } catch (e){
        res.status(ResponseStatus.BadRequest).send(e.message);
    }
})

router.get('/info', verifyToken, async (req, res) =>{
    try {
        const token = req.accessToken;
        const userId = req.userId;
        const response = await UserService.getUserInfoFromToken(userId, token);
        return res.status(200).send(response);
    } catch (e){
        res.status(ResponseStatus.BadRequest).send(e.message);
    }
})

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).select('-password').lean();
        res.status(200).send(user);
    } catch (e){
        console.log(e);
        res.status(500).send('fail to get user');
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const {username, password, confirmPassword, firstname, lastname} = req.body;
        console.log(`register user: ${username}`);
        if (password !== confirmPassword) {
            res.status(400).send('Confirm password not match');
            return;
        }

        const newUser = await UserService.register(username, password, firstname, lastname);
        console.log(`create user success`, newUser);
        res.status(200).send(newUser);
    } catch (e){
        console.error('fail to create user',e);
        res.status(ResponseStatus.BadRequest).send(e.message);
    }
})

router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    console.log(`login user: ${username}`)
    try {
        const loginInfo = await UserService.login(username, password);
        console.log(`login success user: `, loginInfo);
        res.status(200).send(loginInfo);
    } catch (e){
        console.error(e);
        res.status(ResponseStatus.BadRequest).send(e.message);
    }
})

/**
 * update preview avatar
 */
router.patch('/avatar/preview',verifyToken,upload.single('previewAvatar'), async (req,res) => {
    try {
        const {file, userId} = req;
        if (!file) {
            throw Error('File not found');
        }
        const result = await uploadFile(file, `previewAvatar/${userId}`)
            .then((data) => {
                unlink(file.path);
            });
        res.status(200).send(`${process.env.SERVER_DOMAIN}/api/v1/user/avatar/preview/${userId}`);
    }catch (e) {
        console.log(e);
        res.status(500).send(`Fail to upload preview avatar: ${e.toString()} `);
    }
})

/**
 * get preview avatar
 */
router.get('/avatar/preview/:userId', async (req,res) => {
    try{
        const {userId} = req.params;
        res.set('Cache-Control', 'no-store')
        getFileStream(`previewAvatar/${userId}`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send('fail to get preview avatar');
    }
})

/**
 * get avatar
 */
router.get('/:userId/avatar', async (req, res) => {
    try {
        const {userId} = req.params;
        res.set('Cache-Control', 'no-store')
        getFileStream(`avatar/${userId}`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send('Fail to get avatar');
    }

})

/**
 * update avatar
 */
router.patch('/avatar',verifyToken, async (req, res) => {
    const {userId} = req;
    try {
        const mainBucket = process.env.AWS_MAIN_BUCKET_NAME;
        await s3.copyObject({
            Bucket: mainBucket,
            CopySource: `${mainBucket}/previewAvatar/${userId}`,
            Key: `avatar/${userId}`
        }).promise();
        const updateUser = await User.findById(userId);

        //for migration db schema
        if (!updateUser.avatarUrl) {
            updateUser.avatarUrl = `${process.env.SERVER_DOMAIN}/api/v1/user/${userId}/avatar`;
            await updateUser.save();
        }

        res.json('update avatar success');
    } catch (e) {
        console.log(e)
        res.status(500).send(`fail to update avatar picture`)
    }
})

module.exports = router;