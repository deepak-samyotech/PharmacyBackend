const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new Schema({
  em_id: {
    type: String,
    default: null,
  },
  em_ip: {
    type: String,
    default: null,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
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
  role: {
    type: String,
    default: "ADMIN",
  },
 
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

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
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
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
  });

  return schema.validate(data);
};

module.exports = { User, validate };
