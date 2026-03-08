const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, state, category, annualIncome, educationLevel, instituteName, gpa10, gpa12, guardianOccupation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, age, gender, state, category, annualIncome, educationLevel, instituteName, gpa10, gpa12, guardianOccupation
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age || user.age;
      user.gender = req.body.gender || user.gender;
      user.state = req.body.state || user.state;
      user.category = req.body.category || user.category;
      user.annualIncome = req.body.annualIncome || user.annualIncome;
      user.educationLevel = req.body.educationLevel || user.educationLevel;
      user.instituteName = req.body.instituteName || user.instituteName;
      user.gpa10 = req.body.gpa10 || user.gpa10;
      user.gpa12 = req.body.gpa12 || user.gpa12;
      user.guardianOccupation = req.body.guardianOccupation || user.guardianOccupation;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
