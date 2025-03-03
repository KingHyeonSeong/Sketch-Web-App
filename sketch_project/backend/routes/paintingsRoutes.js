require('dotenv').config()

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const Painting = require('../models/Paintings');
const User = require('../models/Users');

// S3 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// Multer 설정 (파일 업로드용)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// S3 이미지 업로드 및 URL 생성
router.post('/upload', upload.single('image'), async (req, res) => {
  const { userId, title, description } = req.body;
  const file = req.file;

  if (!file || !userId || !title) {
    return res.status(400).json({ message: 'Missing required fields or file' });
  }

  // S3 업로드 설정
  const s3Params = {
    Bucket: 'sogang-connected-team7',
    Key: `images/${Date.now()}-${file.originalname}`, // S3에 저장될 파일 경로
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // URL을 통해 공개 접근 가능
  };

  try {
    // S3에 파일 업로드
    const s3Result = await s3.upload(s3Params).promise();

    // MongoDB에 데이터 저장
    const newPainting = new Painting({
      userId,
      title,
      description,
      imageUrl: file.originalname, // 로컬 파일 이름 저장
      s3ImageUrl: s3Result.Location, // S3에서 생성된 URL 저장
    });

    await newPainting.save();
    res.status(201).json({ message: 'Painting saved with S3 URL', painting: newPainting });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ message: 'Error uploading image to S3', error: err.message });
  }
});

// 텍스트 데이터를 업로드
router.post('/upload-text', async (req, res) => {
  const { userId, title, description, textContent } = req.body;

  if (!userId || !title || !textContent) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // S3 업로드 설정
  const s3Params = {
    Bucket: 'sogang-connected-team7',
    Key: `images/${Date.now()}-${title}.txt`, // 저장될 파일 이름
    Body: textContent, // 텍스트 데이터
    ContentType: 'text/plain', // 텍스트 파일 MIME 타입
  };

  try {
    // S3에 파일 업로드
    const s3Result = await s3.upload(s3Params).promise();

    // MongoDB에 데이터 저장
    const newPainting = new Painting({
      userId,
      title,
      description,
      imageUrl: null, // 이미지가 없으므로 null
      s3ImageUrl: s3Result.Location, // S3에서 생성된 URL 저장
    });

    await newPainting.save();
    res.status(201).json({ message: 'Text saved with S3 URL', painting: newPainting });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ message: 'Error uploading text to S3', error: err.message });
  }
});

// Base64 데이터를 텍스트 파일로 저장 후 S3에 업로드
router.post('/upload-base64-as-text', async (req, res) => {
  const { userId, title, base64Data } = req.body;

  if (!userId || !title || !base64Data) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // S3 업로드 설정
    const s3Params = {
      Bucket: 'sogang-connected-team7',
      Key: `base64-texts/${Date.now()}-${title}.txt`, // 저장할 파일 이름
      Body: base64Data, // base64 데이터를 텍스트로 저장
      ContentType: 'text/plain', // MIME 타입
    };

    // S3에 파일 업로드
    const s3Result = await s3.upload(s3Params).promise();

    // MongoDB에 데이터 저장
    const newPainting = new Painting({
      userId,
      title,
      description: null, // 선택사항
      imageUrl: null, // 이미지가 아니므로 null
      s3ImageUrl: s3Result.Location, // S3에서 생성된 URL 저장
    });

    await newPainting.save();
    res.status(201).json({ message: 'Base64 text saved with S3 URL', painting: newPainting });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ message: 'Error uploading base64 text to S3', error: err.message });
  }
});

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

// Get paintings by userId and sort by updatedAt
router.get('/user/:userId/sorted', async (req, res) => {
  const { userId } = req.params;
  console.log(`GET /api/paintings/user/${userId}/sorted 요청 수신`);
  try {
    // 사용자 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 해당 사용자의 모든 그림 가져오기 및 updatedAt 기준 정렬
    const paintings = await Painting.find({ userId }).sort({ updatedAt: -1 }); // 최신순 정렬
    if (!paintings.length) {
      return res.status(404).json({ message: 'No paintings found for this user' });
    }

    console.log('그림 조회 및 정렬 성공:', paintings);
    res.json(paintings);
  } catch (err) {
    console.error('데이터베이스 조회 중 오류 발생:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;