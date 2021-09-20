var Tribe = require('../models/tribe')
var async = require('async')
var Player = require('../models/player')
var Alignment = require('../models/alignment')
var Servercluster = require('../models/servercluster')
var Server = require('../models/server')
var Helper = require('../utility/helperfunctions')
const upload = require("../utility/fileupload");

const { body, validationResult } = require("express-validator");


// Handle create on POST.
exports.tribelog_upload_tribe_log_post = async function (req, res) {
    try {
        await upload(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Choose a file to upload" });
        }
        res.status(200).send({
            message: "File uploaded successfully: " + req.body["file_name"],
        });
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size should be less than 5MB",
            });
        }

        res.status(500).send({
            message: `Error occured: ${err}`,
        });
    }
};

exports.tribelog_get_file_list = async function (req, res) {
    const path = __basedir + "./OCR/Images/Uploads/";

    fs.readdir(path, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Files not found.",
            });
        }

        let filesList = [];

        files.forEach((file) => {
            filesList.push({
                name: file,
                url: URL + file,
            });
        });

        res.status(200).send(filesList);
    });
};

exports.tribelog_download_files = async function (req, res) {
    const fileName = req.params.name;
    const path = __basedir + "./OCR/Images/Uploads/";

    res.download(path + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "File can not be downloaded: " + err,
            });
        }
    });
};


