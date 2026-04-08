const service = require('../services/punch.service');


exports.checkMealBooking = async (req, res) => {
  try {

    const empId = req.params.empid;
    const { timestamp } = req.body;

    const result = await service.checkMealBooking(empId, timestamp);

    return res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};