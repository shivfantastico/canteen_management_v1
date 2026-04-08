const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

exports.registerUser = async (req, res, next) => {
  try {
    const { emp_id, name, department, mobile, password, role } = req.body;
    // console.log( emp_id, name, department, mobile, password, role)
    let user = await userService.findUserByEmpId(emp_id);
    // console.log(user)
    if(user){
      return res.status(409).json({message:"Employee ID already taken"})
    }

    user = await userService.findUserByMobileNumber(mobile);
    if(user){
      return res.status(401).json({message:"Mobile number already registered"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser({
      emp_id,
      name,
      department,
      mobile,
      password_hash: hashedPassword,
      role,
    });

    // console.log("user created");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { emp_id, password } = req.body;

    const user = await userService.findUserByEmpId(emp_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // console.log(token)
    res.json({ token,user: {
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        emp_id: user.emp_id
    } });
  } catch (error) {
    
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    // console.log(users)
    res.json(users);
  } catch (error) {
    console.log(error)
    next(error);
  }
};
