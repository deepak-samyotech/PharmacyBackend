// =================================
const router = require("express").Router();
const { User, validate } = require('../../models/adminlogin/user');
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        console.log("req.body : ",req.body);
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send({ message: "User with given email already exists" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await new User({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
    
});

router.post("/change-password", async (req, res) => {
    return res.status(200).json({
        message: "Password change functionality is not working, sorry for Inconvenience, try it later"
    })
})

module.exports = router;
// ==============================