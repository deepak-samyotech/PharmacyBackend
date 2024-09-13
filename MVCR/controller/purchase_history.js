const model = require("../models/purchase_history.js");
const PurchaseHistory = model.PurchaseHistory;
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");

exports.get = async (req, res) => {
  try {
    const PurchaseHistoryLists = await PurchaseHistory.find({ company_id: req.user?._id });
    if (PurchaseHistoryLists && PurchaseHistoryLists.length > 0) {
      const data = PurchaseHistoryLists.map((item) => ({
        id: item.id,
        supplier_name: item.supplier_name,
        supplier_id: item.supplier_id,
        invoice_no: item.invoice_no,
        date: item.date,
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
  try {
    const { invoice_no } = req.query;

    let query = {};

    if (invoice_no) {
      query.invoice_no = invoice_no;
    }

    const PurchaseHistoryData = await PurchaseHistory.find({ company_id: req.user?._id, query }).select(
      "supplier_name supplier_id invoice_no date details product_name generic_name form expire_date sale_qty trade_price mrp total_amount barcode"
    );

    res.status(200).json({ PurchaseHistoryData });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.post = async (req, res) => {
  try {
    req.body.file_path = "./public/upload/documents";
    req.body.file_name = "image";
    const respUpload = await uploadSingleFile(req, res);

    console.log("respUpload", respUpload);
    if (respUpload.error !== undefined) {
      return res.status(400).json({ errors: [{ msg: respUpload.message }] });
    }

    // Extract data from the request body
    const {
      id,
      supplier_name,
      supplier_id,
      invoice_no,
      date,
      details,
      product_name,
      generic_name,
      form,
      expire_date,
      sale_qty,
      trade_price,
      mrp,
      total_amount,
      barcode,
    } = req.body;

    console.log("req.body", req.body);

    const singleSupplierId = Array.isArray(supplier_id) ? supplier_id[0] : supplier_id;


    // Create the new Purchase
    let newPurchaseHistory = new PurchaseHistory({
      id,
      supplier_name,
      supplier_id: singleSupplierId,
      invoice_no,
      date,
      details,
      product_name,
      generic_name,
      form,
      expire_date,
      sale_qty,
      trade_price,
      mrp,
      total_amount,
      barcode,
      company_id: req.user?._id,
    });
    console.log(newPurchaseHistory, "dj++++s");
    // Save the new Purchase to the database
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
      req.params.id,
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
      req.params.id
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
