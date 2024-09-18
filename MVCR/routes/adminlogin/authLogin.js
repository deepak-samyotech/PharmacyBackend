const router = require("express").Router();
const { User } = require("../../models/adminlogin/user");
const { CreateEmployee } = require("../../models/adminlogin/createEmployee");
const Joi = require("joi");
const bcrypt = require("bcrypt"); // Added bcrypt import

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body); // Changed to use destructuring
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // First, try to find the user in the User collection
        let user = await User.findOne({ email: req.body?.email });
        let validPassword = user ? await bcrypt.compare(req.body.password, user.password) : false;

        if (!user || !validPassword) {
            console.log("I am here");
            // If not found or password is invalid, try to find the user in the CreateEmployee collection
            const createEmployee = await CreateEmployee.findOne({ email: req.body?.email });
            console.log("createEmployee1 ", createEmployee);
            if (createEmployee) {
                console.log("createEmployee2 ", createEmployee);
                validPassword = await bcrypt.compare(req.body?.password, createEmployee?.password);
                if (validPassword) {
                    const token1 = createEmployee.generateAuthToken(); // Assuming a method named generateAuthToken exists in the CreateEmployee model
                    return res.status(200).send({ token: token1, message: "Logged in successfully" });
                }
            }

            // If neither the User nor CreateEmployee authentication was successful
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // If User authentication is successful
        const token = user.generateAuthToken(); // Assuming a method named generateAuthToken exists in the User model
        return res.status(200).send({ token: token, message: "Logged in successfully" });

    } catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;


// const router = require("express").Router();
// const { User } = require("../../models/adminlogin/user");
// const { CreateEmployee } = require ("../../models/adminlogin/createEmployee")
// const Joi = require("joi");
// const bcrypt = require("bcrypt"); // Added bcrypt import

// const validate = (data) => {
//     const schema = Joi.object({
//         email: Joi.string().email().required().label("Email"),
//         password: Joi.string().required().label("Password")
//     });
//     return schema.validate(data);
// }

// router.post("/", async (req, res) => {
//     try {
//         const { error } = validate(req.body); // Changed to use destructuring
//         if (error) {
//             return res.status(400).send({ message: error.details[0].message });
//         }

//         const user = await User.findOne({ email: req.body.email }); // Renamed to avoid conflict with variable name
//         if (!user) {
//             return res.status(401).send({ message: "Invalid email or password" }); // Corrected message
//         }

//         const validPassword = await bcrypt.compare(req.body.password, user.password);
//         if (!validPassword) {
//             return res.status(401).send({ message: "Invalid email or password" });
//         }

//         const token = user.generateAuthToken(); // Assuming a method named generateAuthToken exists in the User model
//         res.status(200).send({ token: token, message: "Logged in successfully" });


//         //employee====================================>
//         const createEmployee = await CreateEmployee.findOne({ email: req.body.email }); // Renamed to avoid conflict with variable name
//         if (!createEmployee) {
//             return res.status(401).send({ message: "Invalid email" }); // Corrected message
//         }
//         const validPassword1 = await bcrypt.compare(req.body.password, createEmployee.password);
//         if (!validPassword1) {
//             return res.status(401).send({ message: "Invalid password" });
//         }

//         const token1 = createEmployee.generateAuthToken(); // Assuming a method named generateAuthToken exists in the User model
//         res.status(200).send({ token: token1, message: "Logged in successfully" });



//     } catch (err) {
//         res.status(500).send({ message: "Internal server error" });
//     }
// });

// module.exports = router;
