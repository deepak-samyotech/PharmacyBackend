const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const createEmployeeSchema = new Schema({
  em_id: {
    type: String,
    default: null,
  },
  em_ip: {
    type: String,
    default: null,
  },
  // firstName: {
  //   type: String,
  //   default: null,
  // },
  // lastName: {
  //   type: String,
  //   default: null,
  // },
  name: {
    type: String,
    default: null
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

createEmployeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const CreateEmployee = mongoose.model("CreateEmployee", createEmployeeSchema);

const validate = (data) => {
  const complexityOptions = {
    min: 8,
    max: 64,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 3,
  };

  const schema = Joi.object({
    // firstName: Joi.string().required().label("First Name"),
    // lastName: Joi.string().required().label("Last Name"),
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .required()
      .label("Password")
      .custom((value, helpers) => {
        const { error } = passwordComplexity(complexityOptions).validate(value);
        if (error) {
          return helpers.error("any.invalid", {
            message:
              "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.",
          });
        }
        return value;
      }),
      contact: Joi.string().required().label("Contact"),
      address: Joi.string().required().label("Address"),
      details: Joi.string().required().label("Details"),
      role: Joi.string().valid("SALESMAN", "ADMIN", "MANAGER").required().label("Role"),
      status: Joi.string().valid("ACTIVE", "INACTIVE").required().label("Status"),
      image: Joi.string().required().label("Image"),
  });

  return schema.validate(data);
};

module.exports = { CreateEmployee, validate };
