const model = require("../models/purchase_history.js");
const PurchaseHistory = model.PurchaseHistory;
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const { Medicine } = require("../models/medicine.js");

exports.get = async (req, res) => {
  try {
      // const PurchaseHistoryLists = await PurchaseHistory.find({
      //   company_id: req.user?._id
      // }).populate({
      //   path: "medicineData.medicine_id",
      //   model: "Medicine",
      //   select:'supplier_name'
    // });
    
    const purchaseHistoryData = await PurchaseHistory.find({ 
      company_id: req.user?._id,
    }).populate({
      path: 'medicineData.medicine_id',
      model: 'Medicine',
      select: 'supplier_name'
    });

    if (purchaseHistoryData && purchaseHistoryData.length > 0) {
      const data = purchaseHistoryData.map((item) => ({
        id: item._id,
        supplier_name: item?.medicineData[0].medicine_id.supplier_name,
        invoice_no: item.invoice_no,
        date: new Date(item.createdAt).toISOString().split('T')[0],
        details: item.details,
        product_name: item.product_name,
        generic_name: item.generic_name,
        form: item.form,
        expire_date: item.expire_date,
        sale_qty: item.sale_qty,
        trade_price: item.trade_price,
        mrp: item.mrp,
        total_amount: item.total_amount,
        barcode: item.barcode,
      }));
      
      res.status(200).json({
        msg: "PurchaseHistory data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in PurchaseHistory collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

//(1.2) GET Api for finding data according to supplier/Company name

exports.search = async (req, res) => {
  // try {
  //   const { invoice_no } = req.query;

  //   let query = {};

  //   if (invoice_no) {
  //     query.invoice_no = invoice_no;
  //   }

  //   const PurchaseHistoryData = await PurchaseHistory.find({ company_id: req.user?._id, ...query }).select(
  //     "supplier_name supplier_id invoice_no date details product_name generic_name form expire_date sale_qty trade_price mrp total_amount barcode"
  //   );

  //   res.status(200).json({ PurchaseHistoryData });
  // } catch (err) {
  //   res.status(500).json({
  //     message: err.message,
  //   });
  // }

  try {
    const { invoice_no } = req.query;
    
    let query = {};
    
    if (invoice_no) {
      query.invoice_no = invoice_no;
    }
    
    const purchaseHistoryData = await PurchaseHistory.find({ 
      company_id: req.user?._id, 
      ...query 
    }).populate({
      path: 'medicineData.medicine_id',
      model: 'Medicine',
      select: '_id supplier_name supplier_id product_name generic_name form expire_date trade_price mrp barcode'
    });

    const formattedData = purchaseHistoryData.map(purchase => ({
      invoice_no: purchase.invoice_no,
      total_amount: purchase.total_amount,
      details: purchase.details,
      date: purchase.createdAt,
      medicineData: purchase.medicineData.map(item => ({
        _id: item.medicine_id?._id,
        supplier_name: item.medicine_id?.supplier_name,
        supplier_id: item.medicine_id?.supplier_id,
        product_name: item.medicine_id?.product_name,
        generic_name: item.medicine_id?.generic_name,
        form: item.medicine_id?.form,
        expire_date: item.medicine_id?.expire_date,
        purchase_qty: item.purchase_qty,
        trade_price: item.medicine_id?.trade_price,
        mrp: item.medicine_id?.mrp,
        barcode: item.medicine_id?.barcode
      }))
    }));

    res.status(200).json({ purchaseHistoryData: formattedData });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.post = async (req, res) => {
  // try {
  //   // req.body.file_path = "./public/upload/documents";
  //   // req.body.file_name = "image";
  //   // const respUpload = await uploadSingleFile(req, res);

  //   // console.log("respUpload", respUpload);
  //   // if (respUpload.error !== undefined) {
  //   //   return res.status(400).json({ errors: [{ msg: respUpload.message }] });
  //   // }

  //   // Extract data from the request body
  //   const {
  //     invoice_no,
  //     details,
  //     total_amount,
  //     medicineData,
  //   } = req.body;

  //   console.log("req.body", req.body);

  //   // const singleSupplierId = Array.isArray(supplier_id) ? supplier_id[0] : supplier_id;


  //   // Create the new Purchase
  //   let newPurchaseHistory = new PurchaseHistory({
  //     invoice_no,
  //     details,
  //     total_amount,
  //     medicineData,
  //     company_id: req.user?._id,
  //   });
    
  //   newPurchaseHistory = await newPurchaseHistory.save();
  //   console.log("newPurchaseHistory", newPurchaseHistory);
  //   res.status(200).json({ newPurchaseHistory: newPurchaseHistory });
  // } catch (err) {
  //   res.status(500).json({
  //     message: err.message,
  //   });
  // }

  try {
    // Extract data from the request body
    const {
      invoice_no,
      details,
      total_amount,
      medicineData,
    } = req.body;

    // Parse the medicineData JSON string
    const parsedMedicineData = JSON.parse(medicineData);

    console.log("parsedMedicineData ", parsedMedicineData);

    await updateInstockQuantity(parsedMedicineData, res);

    // Create the new Purchase
    let newPurchaseHistory = new PurchaseHistory({
      invoice_no,
      details,
      total_amount,
      medicineData: parsedMedicineData,
      company_id: req.user?._id,
    });
    
    newPurchaseHistory = await newPurchaseHistory.save();
    console.log("newPurchaseHistory", newPurchaseHistory);
    res.status(200).json({ newPurchaseHistory: newPurchaseHistory });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.put = async (req, res) => {
  try {
    const updatedPurchaseHistory = await PurchaseHistory.findByIdAndUpdate(
      req.params?.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ updatedPurchaseHistory: updatedPurchaseHistory });
    if (!updatedPurchaseHistory) {
      return res.status(404).json({ message: "PurchaseHistory not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletePurchaseHistoryData = await PurchaseHistory.findByIdAndDelete(
      req.params?.id
    );
    res.status(200).json({
      message: "PurchaseHistory data deleted successfully!",
      data: deletePurchaseHistoryData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


async function updateInstockQuantity(parsedMedicineData,res) {
  try {

    if (!parsedMedicineData) {
      return res.status(400).json({
        success: false,
        error: "Atleast one Quantity needed to update stock Quantity"
      })
    }



    const values = parsedMedicineData.map(async (element) => {
      try {
        const curr_medicine = await Medicine.findById(element?.medicine_id);

        if (!curr_medicine) {
          throw new Error(`Medicine with id ${element?.medicine_id} not found`);
        }

        const newInstockQuantity = parseInt(curr_medicine?.instock) + parseInt(element?.purchase_qty);

        console.log("newInstockQuantity", newInstockQuantity);

        return await Medicine.updateOne(
          { _id: element?.medicine_id },
          {
            $set: {
              instock: newInstockQuantity,
            },
          }
        );
      } catch (error) {
        console.error(`Failed to update medicine with id ${element?.medicine_id}:`, error);
      }
    });

    await Promise.all(values);

    return;

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  }
}