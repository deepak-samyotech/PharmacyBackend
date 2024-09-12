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


        const isValueExist = await PosConfigureData.aggregate([
            {
                $match: {
                    value: value,
                    active: true
                }
            }
        ])

        console.log("isValueExist : ", isValueExist);

        if (isValueExist.length > 0) {
            return res.status(400).json({
                success: false,
                error: `${value} is already configured`
            })
        }

        const product = await Medicine.findByIdAndUpdate(
            productId,
            { posStatus: true },
            { new: true }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            })
        }



        const response = await PosConfigureData.create({
            productId,
            value,
            company_id:req?.user?._id,
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
            success: false,
            error: "Internal server error"
        });
    }
}


exports.get = async (req, res) => {
    try {

        const posConfigData = await PosConfigureData
            .find()
            .populate({
                path: 'productId',
                select: 'product_name'
            })
            .select('productId value active');

        console.log(posConfigData);

        const responseData = posConfigData.map(doc => ({
            id: doc._id,
            productName: doc.productId.product_name,
            value: doc.value,
            active: doc.active
        }));

        console.log(responseData);

        const filteredData = responseData.filter((item) => item.active !== false);
        console.log(filteredData);

        return res.status(200)
            .json({
                success: true,
                filteredData,
                message: "Pos Configured data fetched successfully"
            })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error
        })
    }
}


exports.put = async (req, res) => {
    try {
        const { newValue } = req.body;

        console.log(req.params.id);

        const isValueExist = await PosConfigureData.aggregate([
            {
                $match: {
                    value: newValue,
                    active: true
                }
            }
        ])

        console.log("isValueExist : ", isValueExist);

        if (isValueExist.length > 0) {
            return res.status(400).json({
                success: false,
                error: `${newValue} is already configured`
            })
        }

        const newPosData = await PosConfigureData.findByIdAndUpdate(
            req.params.id,
            { value: newValue },
            { new: true }
        );

        if (!newPosData) {
            return res.status(400).json({
                success: false,
                error: "Invalid Id"
            })
        }

        return res.status(200).json({
            success: true,
            newPosData,
            message: "Value Updated Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                success: false,
                error: "Internal server error"
            })
    }
}


exports.delete = async (req, res) => {
    try {

        const posData = await PosConfigureData.findById(req.params.id);

        await Medicine.updateOne(
            { _id: posData.productId },
            { $set: { posStatus: false } }
        );

        // const posDataDelete = await PosConfigureData.findByIdAndDelete(
        //     req.params.id
        // )

        const posDataDelete = await PosConfigureData.updateOne(
            { _id: req.params.id },
            { $set: { active: false } }
        )

        if (!posDataDelete) {
            return res.status(404).json({
                success: false,
                error: "Invalid Id"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}