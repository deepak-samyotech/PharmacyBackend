const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../../models/adminlogin/user");
const CreateEmployee = require("../../models/adminlogin/createEmployee");


exports.authenticate = function(req, res) {
    try {
        const { token } = req.body;
        if (token) {
            res.send('Authentication successful');
            User.verifyToken(token) || CreateEmployee.verifyToken(token);
        } else {
            res.status(204).json({ message: 'token is empty' });
        }
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: 'error while authenticating' });
    }
};
