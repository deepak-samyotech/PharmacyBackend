const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const { commonStr } = require("./constant");
/**
 * file_path default ./upload
 * file_name default file
 * max_file default 1
 * mime_type default 'image/png','image/jpg','image/jpeg'
 * max_size defailt 1MB
 * required default true
 */
var setStorage = function (upload_path) {

    console.log("upload_path : ", upload_path)
    var storage = multer.diskStorage({
        destination: function (req, file, next) {
            mkdirp.sync(upload_path);
            next(null, upload_path);
        },
        filename: function (req, file, next) {
            var datetimestamp = Date.now();
            next(
                null,
                file.fieldname +
                "-" +
                datetimestamp +
                "." +
                file.originalname.split(".")[file.originalname.split(".").length - 1]
            );
        },
    });
    return storage;
};
const uploadSingleFile = function (req, res) {
    return new Promise(function (resolve, reject) {
        var file_path =
            req.body.file_path != undefined ? req.body.file_path : "./upload";

        console.log("file_path", file_path)
        var file_name =
            req.body.file_name != undefined ? req.body.file_name : "file";

        console.log("file_name", file_name)
        var max_file = req.body.max_file != undefined ? req.body.max_file : 1;
        var mime_type =
            req.body.mime_type != undefined
                ? req.body.mime_type
                : ["image/png", "image/jpg", "image/jpeg"];
        var max_size = req.body.max_size != undefined ? req.body.max_size : 1;
        var storage = setStorage(file_path);

        console.log("storage--------", storage)
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, next) {
                if (mime_type.includes(file.mimetype)) {
                    next(null, true);
                } else {
                    next("File format not matched.", false);
                }
            },
            limits: { fileSize: max_size * 1024 * 1024 },
        }).array(file_name, max_file);



        console.log("upload", upload)
        var old_req = req.body;


        upload(req, res, function (err) {

            console.log("upload.req", req)
            if (err instanceof multer.MulterError) {
                return resolve({ error: 1, message: err.message });
            } else if (err) {
                return resolve({ error: 1, message: err });
            }
            var b = old_req;
            var a = JSON.parse(JSON.stringify(req.body));
            var data = Object.assign({}, a, b);
            data.error = err;
            req.body = data;
            return resolve(req);
        });
    });
};
var setMultiStorage = function (_fields) {
    var storage = multer.diskStorage({
        destination: function (req, file, next) {
            mkdirp.sync(_fields[file.fieldname].file_path);
            next(null, _fields[file.fieldname].file_path);
        },
        filename: function (req, file, next) {
            var datetimestamp = Date.now();
            next(
                null,
                file.fieldname +
                "-" +
                datetimestamp +
                "." +
                file.originalname.split(".")[file.originalname.split(".").length - 1]
            );
        },
    });
    return storage;
};
const uploadMultiFile = function (req, res) {
    return new Promise(function (resolve, reject) {
        var max_size = req.body.max_size != undefined ? req.body.max_size : 1;
        var file_data = req.body.file_data;
        var fields = [];
        var _fields = {};
        file_data.forEach(function (val) {
            val.mime_type =
                val.mime_type != undefined
                    ? val.mime_type
                    : ["image/png", "image/jpg", "image/jpeg"];
            val.max_file = val.max_file != undefined ? val.max_file : 1;
            fields.push({ name: val.file_name, maxCount: val.max_file });
            _fields[val.file_name] = val;
        });
        var storage = setMultiStorage(_fields);
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, next) {
                if (_fields[file.fieldname].mime_type.includes(file.mimetype)) {
                    next(null, true);
                } else {
                    next("File format not matched.", false);
                }
            },
            limits: { fileSize: max_size * 1024 * 1024 },
        }).fields(fields);
        var old_req = req.body;
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return resolve({ error: 1, message: err.message });
            } else if (err) {
                return resolve({ error: 1, message: err });
            }
            var b = old_req;
            var a = JSON.parse(JSON.stringify(req.body));
            var data = Object.assign({}, a, b);
            data.error = err;
            req.body = data;
            return resolve(req);
        });
    });
};
const removeUploadImage = function (files) {
    return new Promise(function (resolve, reject) {
        if (files.length > 0) {
            files.forEach(function (val, key) {
                fs.unlinkSync(val.path);
                if (key + 1 == files.length) {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    });
};
const removeImageByNamePath = function (path, file_names) {
    return new Promise(function (resolve, reject) {
        if (file_names.length > 0) {
            file_names.forEach(function (val, key) {
                if (fs.existsSync(path + val)) fs.unlinkSync(path + val);
                if (key + 1 == file_names.length) {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    });
};
const removeMultiPathImages = function (files, fields) {
    return new Promise(function (resolve, reject) {
        if (fields && files) {
            fields.forEach(function (val, key) {
                if (
                    files[val] != undefined &&
                    files[val][0] != undefined &&
                    files[val][0].path
                )
                    fs.unlinkSync(files[val][0].path);
                if (key + 1 == fields.length) {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    });
};
const uploadImageUsingFS = function (
    base_path,
    imageBase64 = "",
    imageName = ""
) {
    return new Promise(async function (resolve, reject) {
        let timeStamp = new Date().valueOf().toString();
        let base64Data = imageBase64.split("base64,")[1];
        mkdirp.sync(base_path);
        fs.writeFileSync(
            base_path + timeStamp + "-" + imageName,
            base64Data,
            "base64",
            function (err) {
                console.log(err);
            }
        );
        resolve(`${timeStamp}-${imageName}`);
        return;
    });
};
module.exports = {
    uploadSingleFile,
    removeUploadImage
};