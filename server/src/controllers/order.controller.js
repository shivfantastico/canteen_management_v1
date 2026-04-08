const service = require('../services/order.service');

exports.createOrder = async (req, res) => {
  try {
    const data = await service.createOrder(req.user.id, req.body);

    return res.status(201).json(data);

  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to create order"
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await service.getOrders(req.user.id);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Get Orders Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch orders"
    });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const result = await service.updateOrder(orderId, req.body);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result,
    });

  } catch (err) {
    console.error("Update Order Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to update order",
    });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(orderId)
    const result = await service.deleteOrder(orderId);

    res.status(200).json(result);

  } catch (err) {
    console.error("Delete Order Error:", err);

    res.status(500).json({
      message: err.message || "Failed to delete order",
    });
  }
};
