const db = require("../config/db");
const cron = require("node-cron");

exports.createOrder = async (userId, payload) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const createdOrders = [];
    // console.log(payload);

    for (const item of payload.items) {
      // generate order number
      const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM orders`);

      const orderNumber = `ORD-${String(rows[0].count + 1).padStart(4, "0")}`;

      // insert order
      const [orderResult] = await conn.execute(
        `INSERT INTO orders 
  (order_number,user_id,order_date,total_quantity,booking_type,booking_for,guest_name,start_date,end_date,excluded_dates,created_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,NOW())`,
        [
          orderNumber,
          userId,
          payload.order_date,
          item.quantity,
          payload.booking_type,
          payload.booking_for,
          payload.guest_name || null,
          payload.start_date || null,
          payload.end_date || null,
          JSON.stringify(payload.excluded_dates || []),
        ],
      );

      const orderId = orderResult.insertId;

      // insert order item
      await conn.execute(
        `INSERT INTO order_items
        (order_id,meal_type_id,quantity)
        VALUES (?,?,?)`,
        [orderId, item.meal_type_id, item.quantity],
      );

      createdOrders.push({
        order_id: orderId,
        order_number: orderNumber,
      });
    }

    await conn.commit();

    return {
      message: "Orders created successfully",
      orders: createdOrders,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

cron.schedule("0 0 * * *", async () => {
  await db.execute(`
    UPDATE orders
    SET status='CANCELLED'
    WHERE DATE(order_date) < CURDATE()
    AND status='UPCOMING'
  `);

  console.log("Expired orders updated");
});

exports.getOrders = async (userId) => {
  // Update past orders to "CANCELLED" when (order_dt > date.Now()) ==> "CANCELLED"

  await db.execute(
      `
      UPDATE orders
      SET status = 'CANCELLED'
      WHERE DATE(order_date) < CURDATE()
      AND status = 'UPCOMING'
      `
    );

  const [rows] = await db.execute(
    `
    SELECT o.*, mt.name AS meal_name, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN meal_types mt ON mt.id = oi.meal_type_id
    WHERE o.user_id=?
    ORDER BY o.order_date ASC
    `,
    [userId],
  );
  // console.log(rows)

  return rows;
};


exports.updateOrder = async (orderId, payload) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // update order table
    await conn.execute(
      `
      UPDATE orders
      SET 
        booking_type = ?,
        booking_for = ?,
        guest_name = ?,
        start_date = ?,
        end_date = ?,
        excluded_dates = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        payload.booking_type,
        payload.booking_for,
        payload.guest_name || null,
        payload.start_date || null,
        payload.end_date || null,
        JSON.stringify(payload.excluded_dates || []),
        orderId,
      ]
    );

    // delete existing items
    await conn.execute(
      `DELETE FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    // insert new items
    for (const item of payload.items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, meal_type_id, quantity)
         VALUES (?,?,?)`,
        [orderId, item.meal_type_id, item.quantity]
      );
    }

    await conn.commit();

    return {
      order_id: orderId,
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};



exports.deleteOrder = async (orderId) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // delete order items first (foreign key safety)
    await conn.execute(
      `DELETE FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    // delete main order
    const [result] = await conn.execute(
      `DELETE FROM orders WHERE id = ?`,
      [orderId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Order not found");
    }

    await conn.commit();

    return {
      message: "Order deleted successfully",
      order_id: orderId,
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
