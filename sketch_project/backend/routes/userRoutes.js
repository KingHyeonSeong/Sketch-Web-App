const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Get all users
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/users 요청 수신');
    const users = await User.find();
    console.log('데이터베이스에서 사용자 조회 성공:', users);
    res.json(users);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  console.log(`GET /api/users/email/${email} 요청 수신`);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('사용자 조회 성공:', user);
    res.json(user);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get user by username
router.get('/username/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`GET /api/users/username/${username} 요청 수신`);
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('사용자 조회 성공:', user);
    res.json(user); 
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  console.log('POST 요청 수신:', req.body);
  const user = new User(req.body);
  try {
    await user.save();
    console.log('데이터 삽입 성공:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error('데이터 삽입 실패:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;