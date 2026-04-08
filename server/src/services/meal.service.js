const db = require('../config/db');

exports.getAllMeals = async ()=> {
   const [rows1] = await db.execute( 
    `SELECT * FROM meal_types`
   );

   return rows1
}


exports.getMealsWithBookingStatus = async (userId, selDate) => {
  const [meals] = await db.execute(`SELECT * FROM meal_types`);

  const [bookings] = await db.execute(
  `
  SELECT 
    oi.meal_type_id,
    o.booking_type
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.user_id = ?
    AND o.status != 'CANCELLED'
    AND (
      (o.booking_type = 'SINGLE' AND DATE(o.order_date) = DATE(?))
      OR
      (
        o.booking_type = 'MONTHLY'
        AND DATE(?) BETWEEN DATE(o.start_date) AND DATE(o.end_date)
        AND (
          o.excluded_dates IS NULL 
          OR JSON_CONTAINS(
              o.excluded_dates, 
              JSON_QUOTE(DATE_FORMAT(?, '%Y-%m-%d'))
          ) = 0
        )
      )
    )
  `,
  [userId, selDate, selDate, selDate]
);


  const selfSingleSet = new Set();
  const selfMonthlySet = new Set();

  bookings.forEach(b => {
    if (b.booking_type === "SINGLE") {
      selfSingleSet.add(b.meal_type_id);
    } else if (b.booking_type === "MONTHLY") {
      selfMonthlySet.add(b.meal_type_id);
    }
  });

  const result = meals.map(meal => ({
    ...meal,
    isSelfSingleBooked: selfSingleSet.has(meal.id),
    isSelfMonthlyBooked: selfMonthlySet.has(meal.id),
    isBooked:
      selfSingleSet.has(meal.id) || selfMonthlySet.has(meal.id),
  }));

  return result;
};




