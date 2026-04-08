const service = require('../services/meal.service');

exports.getAllMeals = async (req, res, next) => {
  console.log(req.body)
  try {
    const meals = await service.getAllMeals();
    // console.log(meals)
    res.status(200).json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



exports.getMeals = async (req, res, next) => {
  console.log(req.body)
  try {
    const meals = await service.getMealsWithBookingStatus(req.body.userId , req.body.selDate);
    // console.log(meals)
    res.status(200).json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
