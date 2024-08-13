const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  em_id: {
    type: String,
    default: null,
  },
  em_ip: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
  },
  contact: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  details: {
    type: String,
    default: null,
  },
  entrydate: {
    type: String,
    default: null,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["SALESMAN", "ADMIN", "MANAGER"],
    default: "SALESMAN",
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "INACTIVE",
  },
});

exports.Employee = mongoose.model("Employee", employeeSchema);
