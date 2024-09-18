const { User, validate } = require('../../models/adminlogin/user');
const bcrypt = require('bcrypt');


exports.userCreation = async (req, res) => {
    try {

        if (req.user?.role !== 'SUPERADMIN') {
            return res.status(200).json({
                status: false,
                message: 'Unauthorized request',
            })
        }

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
        const response = await new User({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
}

exports.getAdmins = async (req, res) => {
    try {
        if (req.user?.role !== 'SUPERADMIN') {
            return res.status(200).json({
                status: false,
                message: 'Unauthorized request',
            })
        }

        const users = await User.find({ role: 'ADMIN' }).select("-password");
        if (!users) {
            return res.status(200).json({
                status: false
            })
        }

        res.status(200).json({
            status: true,
            users,
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

exports.toggle = async (req, res) => {

    console
    try {
        const id = req.params?.id;
        if (!id) {
            return res.status(404).json({
                status: false,
                message: "Id not found",
            })
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.active = !user.active;

        await user.save();

        // console.log("response  ", response);
        res.status(200).json({
            status: true,
            message: "Status Changed Successfully"
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}