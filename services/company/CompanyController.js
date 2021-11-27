const Company = require("./CompanyModel");
const {s3, uploadFile, getFileStream} = require("../../utils/s3Service");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({dest: "temp/"});
const {unlink} = require("fs/promises");
const crypto = require("crypto");
const {jwtAuth} = require("../../middlewares");

/**
 * get by id
 */
router.get("/:companyId", async (req, res) => {
    try {
        const {companyId} = req.params;
        const company = await Company.findById(companyId).lean();
        if (company.logoVersion) {
            company.logoUrl = `${process.env.SERVER_DOMAIN}/api/v1/company/${companyId}/logo/v${company.logoVersion}`;
        }
        if (company.backdropVersion) {
            company.backDropUrl = `${process.env.SERVER_DOMAIN}/api/v1/company/${companyId}/backdrop/v${company.backdropVersion}`;
        }
        company.photos.forEach((photo) => {
            photo.url = `${process.env.SERVER_DOMAIN}/api/v1/company/${companyId}/photo/${photo.id}`;
        });
        res.status(200).send(company);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get company information");
    }
});

/**
 * get brief list of my company
 */
router.get('/my/brief',jwtAuth.verifyToken, async (req, res) =>{
    try{
        const {userId} = req;
        const listMyCompany = await Company.find({createdByUserId: userId}, {_id: 1, name: 1, address: 1});
        res.status(200).json(listMyCompany);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get list my company");
    }



})

/**
 * get list of company
 */
router.get("/", async (req, res) => {
    try {
        const docs = await Company.find({});
        res.status(200).send(docs);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get company information");
    }
});

/**
 * create
 */
router.post("/", async (req, res) => {
    try {
        const company = req.body;
        const newCompany = await new Company(company).save();
        res.status(200).send(newCompany);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to create company information");
    }
});


/**
 * get logo
 */
router.get("/:companyId/logo/:version", async (req, res) => {
    try {
        const {version, companyId} = req.params;
        res.status(200);
        getFileStream(`company/${companyId}/logo`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get backdrop");
    }
});

/**
 * update logo
 */
router.patch("/:companyId/logo", upload.single("logo"), async (req, res) => {
    try {
        const {companyId} = req.params;
        const {file} = req;
        const s3Response = await uploadFile(file, `company/${companyId}/logo`).then(
            (data) => {
                unlink(file.path);
            }
        );
        const company = await Company.findById(companyId);
        const nextLogoVersion = (company.logoVersion || 0) + 1;
        company.logoVersion = nextLogoVersion;
        await company.save();
        res.status(200).send(`v${nextLogoVersion}`);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to set company logo");
    }
});

/**
 * get backdrop
 */
router.get("/:companyId/backDrop/:version", async (req, res) => {
    try {
        const {version, companyId} = req.params;
        res.status(200);
        getFileStream(`company/${companyId}/backdrop`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get backdrop");
    }
});

/**
 * update backdrop
 */
router.patch(
    "/:companyId/backDrop",
    upload.single("backdrop"),
    async (req, res) => {
        try {
            const {companyId} = req.params;
            const {file} = req;
            const s3Response = await uploadFile(
                file,
                `company/${companyId}/backdrop`
            ).then((data) => {
                unlink(file.path);
            });
            const company = await Company.findById(companyId);
            const nextBackdropVersion = (company.backdropVersion || 0) + 1;
            company.backdropVersion = nextBackdropVersion;
            await company.save();
            res.status(200).send(`v${nextBackdropVersion}`);
        } catch (e) {
            console.log(e);
            res.status(500).send("Fail to set company backDrop");
        }
    }
);

/**
 * get photo
 */
router.get("/:companyId/photo/:id", async (req, res) => {
    try {
        const {id, companyId} = req.params;
        res.status(200);
        getFileStream(`company/${companyId}/photo/${id}`).pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to get photo");
    }
});

/**
 * add a photo
 */
router.patch("/:companyId/photo", upload.single("photo"), async (req, res) => {
    try {
        const {companyId} = req.params;
        const {file} = req;

        const company = await Company.findById(companyId);
        const photoId = crypto.randomBytes(16).toString("hex");
        company.photos.push({id: photoId});
        await company.save();
        const s3Response = await uploadFile(
            file,
            `company/${companyId}/photo/${photoId}`
        ).then((data) => {
            unlink(file.path);
        });
        res
            .status(200)
            .send(
                `${process.env.SERVER_DOMAIN}/api/v1/company/${companyId}/photo/${photoId}`
            );
    } catch (e) {
        console.log(e);
        res.status(500).send("Fail to add a photo");
    }
});

module.exports = router;
