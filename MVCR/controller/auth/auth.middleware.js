const jwt = require("jsonwebtoken");
const { User } = require("../../models/adminlogin/user");

const verifyJWT = async (req, res, next) => {
    try {
        const token = req?.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: false,
                error: "Unauthorized request"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
        // console.log("Decoded token ", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            return res.status(404).json({
                status: false,
                error: "User Not found"
            })
        }

        if (decodedToken?.role === 'ADMIN') {
            req.user = user;
        }
        else {
            req.user = decodedToken;    
        }

        next();
    } catch (error) {
        console.log("error : ", error);

        return res.status(401).json({
            status: false,
            error: "Invalid token"
        })
    }
}

module.exports = verifyJWT;