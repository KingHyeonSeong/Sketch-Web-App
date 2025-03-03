const mongoose = require('mongoose');

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // 사용자 이름
  // email: { type: String, default: 'default@sample.com' }, // 기본값 추가, unique 제거
  password: { type: String, required: true }, // 비밀번호 (해싱된 값)
  createdAt: { type: Date, default: Date.now }, // 계정 생성 날짜
  updatedAt: { type: Date, default: Date.now }, // 계정 수정 날짜
  mode: { type: String, default: 0 } // 키즈모드는 1
});

// User 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
