var express = require('express');
var router = express.Router();
const StaffUser = require("../models/StaffUser");
const isAuthenticated = require('../middleware/isAuthenticated');
const isProfileOwner = require('../middleware/isProfileOwner');






module.exports = router;