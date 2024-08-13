const express = require("express");
const mongoose = require("mongoose");
const server = express();
const cors = require("cors");
const path = require("path");
const PORT = 8080;
require("dotenv").config();

// const employeeRouter = require("./MVCR/routes/employee");
const medicineRouter = require("./MVCR/routes/medicine");
const customerRouter = require("./MVCR/routes/customer");
const supplierRouter = require("./MVCR/routes/supplier");
const purchaseRouter = require("./MVCR/routes/purchase");
const employeeRouter = require("./MVCR/routes/employee");
const settingRouter = require("./MVCR/routes/setting");
const closingRouter = require("./MVCR/routes/closing");
const invoiceRouter = require("./MVCR/routes/manageInvoice");
//ledgers
const customer_ledgerRouter = require("./MVCR/routes/customer_ledger");
const supplier_ledgerRouter = require("./MVCR/routes/supplier_ledger");
const supplier_paymentRouter = require("./MVCR/routes/Supp_payment");
//help section
const fireServiceRouter = require("./MVCR/routes/fireService");
const hospitalRouter = require("./MVCR/routes/hospital");
const policeRouter = require("./MVCR/routes/police");
const doctorRouter = require("./MVCR/routes/doctor");
const ambulanceRouter = require("./MVCR/routes/ambulance");
//Admin auth
const userRegister = require("./MVCR/routes/adminlogin/user");
const employeeRegister = require("./MVCR/routes/adminlogin/createEmployee");
const userLogin = require("./MVCR/routes/adminlogin/authLogin");
const authRoute = require("./MVCR/routes/adminlogin/common");
// const changePassword = require("./MVCR/routes/adminlogin/");

//return
const purchaseReturnRouter = require("./MVCR/routes/purchase_return");
const salesReturnRouter = require("./MVCR/routes/sale_return");

//history
const purchaseHistoryRouter = require("./MVCR/routes/purchase_history");

//Bank data
const bankRouter = require("./MVCR/routes/bank")

// to connect with mongoose

console.log(process.env.IMAGE_BASE_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log("database not connected", err);
  });

//body parser
server.use(cors());
server.use(express.urlencoded({extended:true}));
server.use(express.json());
server.use(express.static("public"));
// server.use("/employee", employeeRouter.router);
server.use("/medicine", medicineRouter.router);
server.use("/customer", customerRouter.router);
server.use("/supplier", supplierRouter.router);
server.use("/purchase", purchaseRouter.router);
server.use("/employee", employeeRouter.router);
server.use("/setting", settingRouter.router);
server.use("/closing", closingRouter.router);
server.use("/manage_invoice", invoiceRouter.router);
//ledgers
server.use("/customer_ledger", customer_ledgerRouter.router);
server.use("/supplier_ledger", supplier_ledgerRouter.router);
server.use("/supplier_payment", supplier_paymentRouter.router);
// help section 
server.use("/fireService", fireServiceRouter.router);
server.use("/hospital", hospitalRouter.router);
server.use("/police", policeRouter.router);
server.use("/doctor", doctorRouter.router);
server.use("/ambulance", ambulanceRouter.router);
//admin auth
server.use("/register", userRegister);
server.use("/employee-register", employeeRegister);
server.use("/login", userLogin);
server.use("/admin", authRoute);


//return
server.use("/purchase_return", purchaseReturnRouter);
server.use("/sale_return", salesReturnRouter);


//history
server.use("/purchase-history", purchaseHistoryRouter.router)

//bank
server.use("/bank", bankRouter.router)

server.listen(PORT, () => {
  console.log("server started");
});
