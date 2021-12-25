const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_MAIN_BUCKET_NAME;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,

})

function uploadFileDefault(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise();
}


function uploadFile(file, name) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: name
    }
    return s3.upload(uploadParams).promise();
}

function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream();
}

async function deleteFileList(fileKeys) {
    const deleteParams = {
        Bucket: bucketName,
        Delete: {
            Objects: fileKeys.map(key => {
                return {Key: key}
            })
        }
    }
    return s3.deleteObjects(deleteParams, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(data);
        return data;
    })
}
async function deleteFile(fileKey) {
    const deleteParams = {
        Bucket: bucketName,
        Delete: {
            Objects: [
                 {Key: fileKey}
            ]
        }
    }
    return s3.deleteObjects(deleteParams, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(data);
        return data;
    })
}

async function getFileSize(fileKey) {
    const fileParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    const data = await s3.headObject(fileParams).promise();
    return data.ContentLength;
}
module.exports ={uploadFileDefault, getFileStream, uploadFile, getFileSize, deleteFile, s3}