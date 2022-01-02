const multer = require("multer");
const School = require('./SchoolModel');
const router = require("express").Router();
const upload = multer({dest: "temp/"});
const {unlink} = require("fs/promises");
const {jwtAuth} = require("../../middlewares");
const {getFileStream, uploadFile} = require("../../utils/s3Service");
const Company = require("./CompanyModel");

/**
 * create a school
 */
router.post('/create', jwtAuth.verifyToken, async (req, res) => {
    try {
        const school = req.body;
        const newSchool = await new School(school).save();
        res.status(200).send(newSchool);
    } catch (e) {
        console.log(e);
        res.status(500).send('Fail to create school');
    }
})

/**
 * update logo
 */
router.patch(
    "/:schoolId/logo",
    upload.single("schoolLogo"),
    async (req, res) => {
        try {
            const {schoolId} = req.params;
            const {file} = req;
            const s3Response = await uploadFile(
                file,
                `school/${schoolId}/logo`
            ).then((data) => {
                unlink(file.path);
            });
            const school = await School.findById(schoolId);
            const nextLogoVersion = (school.logoVersion || 0) + 1;
            school.logoVersion = nextLogoVersion;
            await school.save();
            res.status(200).send(`v${nextLogoVersion}`);
        } catch (e) {
            console.log(e);
            res.status(500).send("Fail to set school logo");
        }
    }
);

/**
 * get logo
 */
router.get("/:schoolId/logo/:version", async (req, res) => {
    try {
        const {version, schoolId} = req.params;
        res.status(200);
        getFileStream(`school/${schoolId}/logo`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get school logo");
    }
});
