const model = require("../models/posConfigure");
const PosConfigureData = model.PosConfigureData;

const medicineModel = require("../models/medicine");
const Medicine = medicineModel.Medicine;

exports.post = async (req, res) => {
    try {
        
        const { productId, value } = req.body;

        if (!(productId && value)) {
            return res.status(400).json({
                success: false,
                error: "All fields required"
            });
        }

        const product = await Medicine.findByIdAndUpdate(
            productId,
            { posStatus: true },
            {new: true}
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            })
        }

        const response = await PosConfigureData.create({
            productId,
            value
        });

        console.log("response ", response);

        if (!response) {
            return res.status(400).json({
                error: "Unable to save configuration!"
            });
        }

        res.status(200).json({
            success: true,
            // response
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}