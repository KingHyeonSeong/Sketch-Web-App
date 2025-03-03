// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// // 라우터 가져오기
// const userRoutes = require('./routes/userRoutes');
// const systemRoutes = require('./routes/systemRoutes');
// const paintingRoutes = require('./routes/paintingsRoutes');

// mongoose.set('debug', true);

// const app = express();
// const port = process.env.PORT || 5000;
// const mongoURI = process.env.MONGODB_URI;

// mongoose.set('strictQuery', false);

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃 (5초)
//   connectTimeoutMS: 5000, // 연결 타임아웃 (5초)
//   socketTimeoutMS: 45000, // 소켓 타임아웃 (45초)
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1); // 연결 실패 시 프로세스 종료
//   });

// // 미들웨어
// app.use(cors());  
// app.use(express.json());

// // 정적 파일 제공
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 라우터 설정
// app.use('/api/users', userRoutes);
// app.use('/api', systemRoutes); // /api/system-info
// app.use('/api/paintings', paintingRoutes);

// // 404 핸들러
// app.use((req, res, next) => {
//   res.status(404).json({ error: 'Endpoint not found' });
// });

// // 에러 핸들러
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// // 서버 시작
// app.listen(port, () => console.log(`Server listening on port ${port}`));

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// 라우터 가져오기
const userRoutes = require('./routes/userRoutes');
const systemRoutes = require('./routes/systemRoutes');
const paintingRoutes = require('./routes/paintingsRoutes');

mongoose.set('debug', true);

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃 (5초)
  connectTimeoutMS: 5000, // 연결 타임아웃 (5초)
  socketTimeoutMS: 45000, // 소켓 타임아웃 (45초)
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // 연결 실패 시 프로세스 종료
  });

// 미들웨어
app.use(cors());

// 요청 크기 제한 설정 (10MB로 제한)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우터 설정
app.use('/api/users', userRoutes);
app.use('/api', systemRoutes); // /api/system-info
app.use('/api/paintings', paintingRoutes);

// 404 핸들러
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.type === 'entity.too.large') {
    // 요청 크기 초과 오류 처리
    res.status(413).json({ error: 'Payload Too Large' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 서버 시작
app.listen(port, () => console.log(`Server listening on port ${port}`));