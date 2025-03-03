const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공!'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 사용자 생성 함수
async function createUser(username, email, password) {
  const newUser = new User({ username, email, password });
  await newUser.save();
  console.log('사용자 생성 완료:', newUser);
}

// 실행
createUser('JohnDoe', 'johndoe@example.com', 'securepassword123');
