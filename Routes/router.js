const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");
const customercontrollers = require("../controllers/customerController");


// Routes
router.post("/user/register",controllers.userregister);
router.post("/user/sendotp",controllers.userOtpSend);
router.post("/user/login",controllers.userLogin);
router.post("/user/adminLogin",controllers.adminLogin);
router.post("/user/logout",controllers.adminLogout);
router.post("/user/customerregister",customercontrollers.customerregister);
router.post("/customerList",customercontrollers.customerList);
router.post("/userDetails",customercontrollers.userDetails);
router.post("/updateDownloads",customercontrollers.updateDownloads);
router.post("/uploadFile",customercontrollers.uploadFile);


module.exports = router;