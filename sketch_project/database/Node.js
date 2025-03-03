

// 사용자 가입
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await newUser.save();
  console.log("사용자 계정 생성 완료!");
}

// 그림 저장
const Painting = require('./models/Painting');

async function savePainting(userId, title, description, imageUrl) {
  const newPainting = new Painting({
    userId,
    title,
    description,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await newPainting.save();
  console.log("그림 저장 완료!");
}

// 사용자 그림 조회
async function getUserPaintings(userId) {
    const paintings = await Painting.find({ userId });
    console.log("사용자 그림 목록:", paintings);
    return paintings;
}
  
// 그림 삭제
async function deletePainting(paintingId) {
   await Painting.findByIdAndDelete(paintingId);
   console.log("그림 삭제 완료!");
}
  
// 그림 파일 저장 (AWS S3 : 그림 데이터를 업로드하고 URL 저장)
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function uploadImageToS3(file) {
  const params = {
    Bucket: 'your-s3-bucket-name',
    Key: `images/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const uploadResult = await s3.upload(params).promise();
  console.log("파일 업로드 완료:", uploadResult.Location);
  return uploadResult.Location; // S3에 저장된 파일 URL 반환
}
