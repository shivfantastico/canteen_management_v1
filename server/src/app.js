const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const mealRoutes = require("./routes/meal.routes");
const punchRoutes = require("./routes/punch.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/meal", mealRoutes);
app.use("/api/zk/punch", punchRoutes);

app.use(errorHandler);

module.exports = app;
