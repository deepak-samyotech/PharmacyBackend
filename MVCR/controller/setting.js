const model = require("../models/setting");
const mongoose = require("mongoose");
const Setting = model.Setting;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the Setting
exports.get = async (req, res) => {
  try {
    // Fetch data from Setting collection
    const settingLists = await Setting.find();

    if (settingLists && settingLists.length > 0) {
      // Prepare response data
      const data = settingLists.map((item) => ({
        id: item.id,
        name: item.name,
        sitetitle: item.sitetitle,
        description: item.description,
        copyright: item.copyright,
        contact: item.contact,
        currency: item.currency,
        email: item.email,
        symbol: item.symbol,
        address: item.address,
        image: `${process.env.IMAGE_BASE_URL}${item.image}`,
      }));

      res.status(200).json({
        msg: "data",
        data: data,
      });
      return;
    }

    res.status(200).json({
      message: "Setting List",
      data: settingLists,
      count: settingLists.length,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};
``;

//(2.) POST : to send the data on database
exports.post = async (req, res) => {
  try {
    req.body.file_path = "./public/upload/documents";
    req.body.file_name = "image";
    const respUpload = await uploadSingleFile(req, res);

    console.log("respUpload", respUpload);
    if (respUpload.error !== undefined) {
      return res.status(400).json({ errors: [{ msg: respUpload.message }] });
    }

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await removeUploadImage(respUpload.files);
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from the request body
    const {
      id,
      name,
      sitetitle,
      description,
      copyright,
      contact,
      currency,
      symbol,
      email,
      address,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new Setting
    let newSetting = new Setting({
      id,
      name,
      sitetitle,
      description,
      copyright,
      contact,
      currency,
      symbol,
      email,
      address,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    });

    // Save the new Setting to the database
    newSetting = await newSetting.save();
    console.log("newSetting", newSetting);
    res.status(200).json({ newSetting: newSetting });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//(3.) PUT : to update the data on database
exports.put = async (req, res) => {
  try {
    req.body.file_path = "./public/upload/documents";
    req.body.file_name = "image";
    const respUpload = await uploadSingleFile(req, res);

    console.log("respUpload", respUpload);
    if (respUpload.error !== undefined) {
      return res.status(400).json({ errors: [{ msg: respUpload.message }] });
    }

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await removeUploadImage(respUpload.files);
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      id,
      name,
      sitetitle,
      description,
      copyright,
      contact,
      currency,
      symbol,
      email,
      address,
    } = req.body;

    const updatedData = {
      id,
      name,
      sitetitle,
      description,
      copyright,
      contact,
      currency,
      symbol,
      email,
      address,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    };

    const updatedSetting = await Setting.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedSetting", updatedSetting);
    res.status(200).json({ updatedSetting: updatedSetting });
    if (!updatedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    // res.json(updatedSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteSettingData = await Setting.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Setting data deleted successfully!",
      data: deleteSettingData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
