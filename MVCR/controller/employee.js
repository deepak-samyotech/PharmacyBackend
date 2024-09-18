const model = require("../models/employee.js");
const Employee = model.Employee;
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const { validationResult } = require("express-validator");
const multer = require("multer");
const { CreateEmployee } = require("../models/adminlogin/createEmployee.js");
const upload = multer();

// Function to generate custom employment ID
const generateEmploymentId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `emp${randomNumber}`;
};
// Function to format date as dd/mm/yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    // Fetch data from Employee collection
    const employeeLists = await Employee.find({ company_id: req.user?._id });

    if (employeeLists && employeeLists.length > 0) {
      // Prepare response data
      const data = employeeLists.map((item) => ({
        id: item.id,
        em_id: item.em_id,
        em_ip: item.em_ip,
        em_name: item.em_name,
        email: item.email,
        password: item.password,
        em_contact: item.em_contact,
        em_address: item.em_address,
        em_details: item.em_details,
        em_entrydate: item.em_entrydate,
        em_role: item.em_role,
        status: item.status,
        image: `${process.env.IMAGE_BASE_URL}${item.image}`,
      }));

      res.status(200).json({
        msg: "Employee data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in Employee collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

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

    // Get the IP address of the client
    const em_ip = req.ip;
    // Generate custom employment ID with prefix "emp" and 5-digit number
    const em_id = generateEmploymentId();
    // Generate the current date and time
    const em_entrydate = formatDate(new Date());
    // Extract data from the request body
    const {
      id,
      em_name,
      email,
      password,
      em_contact,
      em_address,
      em_details,
      em_role,
      status,
    } = req.body;

    // Create the new Employee
    let newEmployee = new Employee({
      em_id, // Assign custom employment ID
      em_ip,
      em_name,
      email,
      password,
      em_contact,
      em_address,
      em_details,
      em_entrydate,
      em_role,
      status,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
      company_id: req.user?._id,
    });

    // Save the new Employee to the database
    newEmployee = await newEmployee.save();
    console.log("newEmployee", newEmployee);
    res.status(200).json({ newEmployee: newEmployee });
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
      // firstName,
      // lastName,
      name,
      email,
      password,
      contact,
      address,
      role,
      // em_entrydate,
      status,
    } = req.body;

    console.log("req.body == ", req.body);
    console.log("req.params == ", req.params.id);

    const updatedData = {
      // firstName,
      // lastName,
      name,
      email,
      password,
      contact,
      address,
      role,
      status,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    };

    console.log("UpdatedData  : ", updatedData);
    const updatedEmployee = await CreateEmployee.findByIdAndUpdate(
      { _id: req.params.id },
      updatedData,
      { new: true }
    );
    console.log("updatedEmployee", updatedEmployee);

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ updatedEmployee: updatedEmployee });
    // res.json(updatedEmployee);
  } catch (error) {
    console.log("error : ", error);
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteEmployeeData = await Employee.findByIdAndDelete(req.params?.id);
    res.status(200).json({
      message: "Employee data deleted successfully!",
      data: deleteEmployeeData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
