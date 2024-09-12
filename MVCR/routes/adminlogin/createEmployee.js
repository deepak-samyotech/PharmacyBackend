const router = require("express").Router();
const { CreateEmployee, validate } = require('../../models/adminlogin/createEmployee');
const bcrypt = require("bcrypt");
const multer = require("multer");
const { uploadSingleFile, removeUploadImage } = require("../../../utils/upload");
const { validationResult } = require("express-validator");
const verifyJWT = require("../../controller/auth/auth.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/documents');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Function to generate a custom ID
const generateCustomID = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

//(1.) GET: to find the Customer
router.get("/", async (req, res) => {
    try {
      // Fetch data from Employee collection
      const employeeLists = await CreateEmployee.find();
  
      if (employeeLists && employeeLists.length > 0) {
        // Prepare response data
        const data = employeeLists.map((item) => ({
          id:item._id,
          em_id: item.em_id,
          // firstName: item.firstName,
          // lastName: item.lastName,
          name: item.name,
          email: item.email,
          contact: item.contact,
          role: item.role,
          address: item.address,
          status: item.status
        }));
  
        res.status(200).json({
          msg: "Employee Lists data",
          data: data,
        });
      } else {
        res.status(200).json({
          message: "No data found in Employee Data",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  });


router.post("/", upload.single('image'), verifyJWT, async (req, res) => {
    try {
        console.log("req.body : ", req.body);
        console.log("req.file : ", req.file);

        if (!req.file) {
            return res.status(400).send({ message: "Image is required" });
        }

        req.body.image = req.file.filename;

        // Validate the request body using the Joi schema
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // Check if a user with the given email already exists
        const existingUser = await CreateEmployee.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(402).json({ message: "Employee with given email already exists" });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Generate custom em_id and em_ip
        const em_id = generateCustomID("EnmID");
        const em_ip = generateCustomID("EmpIP");

        // Create a new user with the hashed password and other request body data
        const createEmployee = new CreateEmployee({
            em_id: em_id,
            em_ip: em_ip,
            // firstName: req.body.firstName,
          // lastName: req.body.lastName,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            contact: req.body.contact,
            address: req.body.address,
            details: req.body.details,
            entrydate: req.body.entrydate || null,
            role: req.body.role,
            status: req.body.status,
            image: req.body.image,
            company_id: req.user?._id,
        });

        // Save the user to the database
        await createEmployee.save();

        // Respond with a success message
        res.status(201).send({ message: "Employee created successfully" });
    } catch (err) {
        // Log and respond with an error message if any error occurs
        console.error("Error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
});

router.post("/change-password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Find the user by email
        const createEmployee = await CreateEmployee.findOne({ email });
        if (!createEmployee) {
            return res.status(404).send({ message: "Employee not found" });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, createEmployee.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid old password" });
        }

        // Generate new hash for the new password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update createEmployee's password
        createEmployee.password = hashedPassword;
        await createEmployee.save();

        res.status(200).send({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;



// =================================
// const router = require("express").Router();
// const { User, validate } = require('../../models/adminlogin/user');
// const bcrypt = require("bcrypt");

// router.post("/", async (req, res) => {
//     try {
//         console.log("req.body : ",req.body);
//         const { error } = validate(req.body);
//         if (error) {
//             return res.status(400).send({ message: error.details[0].message });
//         }
//         const existingUser = await User.findOne({ email: req.body.email });
//         if (existingUser) {
//             return res.status(409).send({ message: "User with given email already exists" });
//         }
//         const salt = await bcrypt.genSalt(Number(process.env.SALT));
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
//         await new User({ ...req.body, password: hashedPassword }).save();
//         res.status(201).send({ message: "User created successfully" });
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send({ message: "Internal server error" });
//     }
    
// });

// module.exports = router;
// ==============================