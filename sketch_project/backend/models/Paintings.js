const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 ID
  title: { type: String, required: true }, // 그림 제목
  description: { type: String }, // 그림 설명 (선택)
  summary: { type: String }, // 그림 요약 (선택)
  text: { type: String }, // 텍스트 추출 (선택)
  imageUrl: { type: String }, // URL로 이미지 경로 저장
  s3ImageUrl: {type: String }, // s3 URL 이미지 경로 저장
  preview: { type: String }, // URL로 미리보기 저장
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;
