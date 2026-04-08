const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (body) => {
  const { emp_id, name, mobile, password } = body;

  const hashed = await bcrypt.hash(password, 10);

  const [result] = await db.execute(
    `INSERT INTO users 
    (emp_id,name,mobile,password_hash,created_at)
    VALUES (?,?,?,?,NOW())`,
    [emp_id, name, mobile, hashed]
  );

  return { message: "User registered" };
};

exports.login = async ({ emp_id, password }) => {

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE emp_id=? AND is_active=1`,
    [emp_id]
  );

  if (!rows.length) throw new Error("User not found");

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  };
};
