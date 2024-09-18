const express = require('express');
const router = express.Router();

const superAdminController = require('../../controller/superAdmin/superAdmin');
const verifyJWT = require('../../controller/auth/auth.middleware');

router.use(verifyJWT);
router.post('/create-user', superAdminController.userCreation);
router.get('/all-admin', superAdminController.getAdmins);
router.put('/change-status/:id', superAdminController.toggle);

exports.router = router;