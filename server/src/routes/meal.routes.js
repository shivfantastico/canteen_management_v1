const express = require('express');
const router = express.Router();
const controller = require('../controllers/meal.controller');

router.get('/', controller.getAllMeals);
router.post('/', controller.getMeals);

module.exports = router;
