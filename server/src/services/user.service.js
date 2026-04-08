const pool = require("../config/db");

exports.createUser = async (userData) => {
  const { emp_id, name, department, mobile, password_hash, role } = userData;

  const [result] = await pool.execute(
    `INSERT INTO users 
     (emp_id, name, department, mobile, password_hash, role) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [emp_id, name, department, mobile, password_hash, role]
  );

  return result;
};

exports.findUserByEmpId = async (emp_id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE emp_id = ?",
    [emp_id]
  );
  return rows[0];
};

exports.findUserByMobileNumber = async (mobile) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE mobile = ?",
    [mobile]
  );
  return rows[0];
};



exports.getAllUsers = async () => {
  const [rows] = await pool.execute("SELECT * FROM users");
  return rows;
};
