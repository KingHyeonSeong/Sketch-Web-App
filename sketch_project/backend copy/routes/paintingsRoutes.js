const express = require('express');
const router = express.Router();
const Painting = require('../models/Paintings');

// Get all paintings
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/paintings 요청 수신');
    const paintings = await Painting.find().populate('userId', 'username email'); // userId를 populate하여 관련 사용자 정보 포함
    console.log('데이터베이스에서 그림 조회 성공:', paintings);
    res.json(paintings);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get painting by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/paintings/${id} 요청 수신`);
  try {
    const painting = await Painting.findById(id).populate('userId', 'username email');
    if (!painting) {
      return res.status(404).json({ message: 'Painting not found' });
    }
    console.log('그림 조회 성공:', painting);
    res.json(painting);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get paintings by user ID
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`GET /api/paintings/user/${userId} 요청 수신`);
  try {
    const paintings = await Painting.find({ userId }).populate('userId', 'username email');
    if (!paintings.length) {
      return res.status(404).json({ message: 'No paintings found for this user' });
    }
    console.log('사용자별 그림 조회 성공:', paintings);
    res.json(paintings);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new painting
router.post('/', async (req, res) => {
  console.log('POST /api/paintings 요청 수신:', req.body);
  const painting = new Painting(req.body);
  try {
    await painting.save();
    console.log('새 그림 저장 성공:', painting);
    res.status(201).json(painting);
  } catch (err) {
    console.error('새 그림 저장 실패:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update a painting by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /api/paintings/${id} 요청 수신`);
  try {
    const painting = await Painting.findByIdAndUpdate(id, req.body, { new: true });
    if (!painting) {
      return res.status(404).json({ message: 'Painting not found' });
    }
    console.log('그림 업데이트 성공:', painting);
    res.json(painting);
  } catch (err) {
    console.error('그림 업데이트 실패:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete a painting by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/paintings/${id} 요청 수신`);
  try {
    const painting = await Painting.findByIdAndDelete(id);
    if (!painting) {
      return res.status(404).json({ message: 'Painting not found' });
    }
    console.log('그림 삭제 성공:', painting);
    res.sendStatus(204);
  } catch (err) {
    console.error('그림 삭제 실패:', err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;