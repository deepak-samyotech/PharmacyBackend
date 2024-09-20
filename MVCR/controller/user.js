const { User, validate } = require('../models/adminlogin/user');

exports.get = async (req, res) => {
    try {
        const response = await User.findById(req.params?.id).select("-password");

        if (!response) {
            return res.status(404).json({
                status: false,
                error: "Admin Not found"
            })
        }

        res.status(200).json({
            status: true,
            user: response,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        })
    }
}