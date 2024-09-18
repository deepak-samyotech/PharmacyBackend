const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new Schema({
  companyName: {
    type: String,
    default: null,
  },
  // lastName: {
  //   type: String,
  //   default: null,
  // },
  description: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: Number,
    default:null
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "ADMIN",
  },
  active: {
    type: Boolean,
    default:false
  },
 
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role:this.role, active:this.active }, process.env.JWTPRIVATEKEY, {
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
    companyName: Joi.string().required().label("companyName"),
    description: Joi.string().required().label("description"),
    email: Joi.string().email().required().label("email"),
    phoneNumber: Joi.number().required().label("phoneNumber"),
    password: Joi.string()
      .required()
      .label("password")
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
