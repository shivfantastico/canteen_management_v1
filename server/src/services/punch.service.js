const db = require("../config/db");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  console.log("Clearing todays_booking table for new day...");

  const connection = await db.getConnection();

  try {
    await connection.query(`
      TRUNCATE TABLE todays_booking
    `);

    console.log("todays_booking cleared");
  } catch (err) {
    console.error(err);
  }

  connection.release();
});

// cron.schedule("0 10,12,15,16 * * *", async () => {
//   console.log("Running scheduler...");
//   updateTodaysBooking();
// });


// cron.schedule("* * * * *", async () => {
//   console.log("Running scheduler every minute...");
//   updateTodaysBooking();
// });

// cron.schedule("14 09 * * *", () => {
//   console.log("Running scheduler at 12:35 PM...");
//   updateTodaysBooking();
// });

const updateTodaysBooking = async () => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(`

    INSERT INTO todays_booking
    (emp_id, name, order_date, order_id, meal_type_id, cutoff_time)

    SELECT
    u.emp_id,
    u.name,
    CURDATE(),
    o.id,
    oi.meal_type_id,
    mt.cutoff_time

    FROM orders o

    JOIN users u 
    ON o.user_id = u.id

    JOIN order_items oi 
    ON oi.order_id = o.id

    JOIN meal_types mt 
    ON mt.id = oi.meal_type_id

    WHERE o.status = 'UPCOMING'

    AND (

    (o.booking_type = 'SINGLE'
     AND o.order_date = CURDATE())

    OR

    (
        o.booking_type = 'MONTHLY'
        AND CURDATE() BETWEEN DATE(o.start_date) AND DATE(o.end_date)
        AND (
            o.excluded_dates IS NULL
            OR JSON_CONTAINS(
                o.excluded_dates,
                JSON_QUOTE(DATE_FORMAT(CURDATE(), '%Y-%m-%d'))
            ) = 0
        )
    )

)

AND NOT EXISTS (
    SELECT 1
    FROM todays_booking tb
    WHERE tb.order_id = o.id
    AND tb.meal_type_id = oi.meal_type_id
);
    `);
    //  Above NOT EXISTS logic prevents same booking to be inserted multiple times

    await connection.commit();

    console.log("Today's booking updated");
  } catch (err) {
    await connection.rollback();
    console.error(err);
  }

  connection.release();
};

exports.checkMealBooking = async (empId, timestamp) => {
  const connection = await db.getConnection();

  try {
    const punchTime = new Date(timestamp).toTimeString().slice(0, 8);

    // 1️⃣ Get all today's bookings
    const [allBookings] = await connection.query(
      `
      SELECT tb.*, mt.name AS meal_name, mt.punch_time
      FROM todays_booking tb
      JOIN meal_types mt ON mt.id = tb.meal_type_id
      WHERE tb.emp_id = ?
      AND tb.order_date = CURDATE()
      `,
      [empId]
    );

    if (allBookings.length === 0) {
      const response = {
        status: "DENIED",
        message: "No booking found for today"
      };

      global.io.to(`${empId}`).emit("punch_result", response);
      return response;
    }

    // 2️⃣ Check pending meals
    const pendingMeals = allBookings.filter(b => b.verified === 0);

    if (pendingMeals.length === 0) {
      const response = {
        status: "DENIED",
        message: "All meals already consumed"
      };

      global.io.to(`${empId}`).emit("punch_result", response);
      return response;
    }

    // 3️⃣ Find valid meal
    const [rows] = await connection.query(
      `
      SELECT tb.*, mt.name AS meal_name, mt.punch_time, o.order_number
      FROM todays_booking tb
      JOIN meal_types mt ON mt.id = tb.meal_type_id
      JOIN orders o ON o.id = tb.order_id

      WHERE tb.emp_id = ?
      AND tb.order_date = CURDATE()
      AND tb.verified = 0

      AND TIME(?) <= mt.punch_time

      AND TIME(?) > IFNULL(
          (
              SELECT MAX(mt2.punch_time)
              FROM meal_types mt2
              WHERE mt2.punch_time < mt.punch_time
          ),
          '00:00:00'
      )

      ORDER BY mt.punch_time ASC
      LIMIT 1
      `,
      [empId, punchTime, punchTime]
    );

    // ❌ CASE: Wrong time
    if (rows.length === 0) {
      const nextMeal = pendingMeals
        .sort((a, b) => a.punch_time.localeCompare(b.punch_time))[0];

      const response = {
        status: "DENIED",
        message: `Too early for ${nextMeal.meal_name}. Please come later.`,
        order_number:nextMeal.order_number,
        next_allowed_meal: nextMeal.meal_name,
        punch_time: nextMeal.punch_time
      };

      global.io.to(`${empId}`).emit("punch_result", response);
      return response;
    }

    const booking = rows[0];

    // ✅ Mark verified
    await connection.query(
      `
      UPDATE todays_booking
      SET verified = 1,
          verified_at = NOW()
      WHERE id = ?
      `,
      [booking.id]
    );

    // ✅ Update order
    await connection.query(
      `
      UPDATE orders
      SET status = 'COMPLETED'
      WHERE id = ?
      `,
      [booking.order_id]
    );
    console.log(booking)
    const response = {
      status: "COMPLETED",
      emp_id: empId,
      order_number: booking.order_number,
      meal: booking.meal_name,
      message: `${booking.meal_name} verified successfully`
    };

    // 🔥 EMIT SUCCESS
    global.io.to(`${empId}`).emit("punch_result", response);

    return response;


  } catch (error) {
    console.error(error);

    const response = {
      status: "ERROR",
      message: "Verification failed"
    };

    // 🔥 EMIT ERROR (optional but useful)
    global.io.to(`${empId}`).emit("punch_result", response);

    return response;

  } finally {
    connection.release();
  }
};


