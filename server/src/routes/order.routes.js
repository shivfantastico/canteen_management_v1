const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, controller.createOrder);
router.get('/', auth, controller.getOrders);
router.patch("/:id", auth, controller.updateOrder);
router.delete("/:id", auth, controller.deleteOrder);


module.exports = router;
