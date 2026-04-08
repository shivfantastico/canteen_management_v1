const express = require('express');
const router = express.Router();
const controller = require('../controllers/punch.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/:empid', controller.checkMealBooking);



module.exports = router;
