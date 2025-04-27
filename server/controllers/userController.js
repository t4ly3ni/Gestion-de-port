import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    if (!name || !password || !role) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const existing = await User.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already exists.' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashPassword, role });
    await user.save();
    res.status(201).json({ success: true, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role } = req.body;
    const update = { name, role };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true, fields: '-password' });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
