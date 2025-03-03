const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 ID
  title: { type: String, required: true }, // 그림 제목
  description: { type: String }, // 그림 설명 (선택)
  imageUrl: { type: String, required: true }, // URL로 이미지 경로 저장
  preview: { type: String, required: true }, // URL로 미리보기 저장
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;
