## 1. Introduction

### 문서 목적
본 문서의 목적은 기본적인 그리기 및 편집 기능이 문제없이 동작하고, AI 기술과 WebOS 특화 기능을 활용하여 사용자 경험(UX)을 극대화한 WebOS Sketch Web 애플리케이션의 요구사항을 기술하는 것이다.

### 시스템 범위 (System Scope)

Sketch Web Application은 WebOS 플랫폼에서 동작하며, 다음과 같은 기능을 제공합니다:
- 사용자 계정 관리 및 키즈 모드 설정.
- 기본적인 스케치 도구와 편집 기능 (펜, 지우개, Undo/Redo 등).
- AI 기반 스케치 제목 추천, 텍스트 추출, 스케치 레퍼런스 제공.
- 여러 스케치 병합 및 다양한 형식(PNG, JPEG, PDF)으로 내보내기.

## 2. Architectural Drivers

### Use case diagram
<img src="usecase.png" width="500" height="300"/>

### 2.1 기능 요구사항 (Functional Requirements)

#### 2.1.1 로그인 이전 상태
1. `FR01`: 사용자 계정 관리
   - `FR01-1`: 사용자로부터 계정 생성 요청을 받으면, 이름, 이메일, 비밀번호를 입력받아 새 계정을 생성한다.
   - `FR01-2`: 사용자로부터 로그인 요청을 받으면, 사용자 ID와 비밀번호를 확인하여 인증 후 로그인 상태로 전환한다.
   - `FR01-3`: 키즈 모드 활성화 여부를 선택할 수 있도록 한다.

#### 2.1.2 로그인 이후 상태
2. `FR02`: 스케치 작업
   - `FR02-1`: 사용자 요청으로 Canvas를 초기화하여 스케치를 생성한다.
   - `FR02-2`: 기본 스케치 도구(펜, 지우개, 색상 변경)를 통해 스케치를 편집할 수 있도록 한다.
   - `FR02-3`: 사용자 요청 시 Undo/Redo 기능을 통해 편집 작업을 되돌릴 수 있다.
   - `FR02-4`: 여러 스케치를 병합하여 새로운 스케치를 생성한다.
   - `FR02-5`: 병합된 스케치를 PNG, JPEG, PDF 형식으로 내보낼 수 있도록 한다.
   - `FR02-6`: 스케치를 MongoDB 데이터베이스에 저장하거나 불러올 수 있다.

3. `FR03`: AI 기반 기능
   - `FR03-1`: AI를 활용하여 스케치 제목을 자동으로 생성한다.
   - `FR03-2`: 사용자의 요청에 따라 관련 스케치 이미지를 추천한다.
   - `FR03-3`: 스케치내의 텍스트를 인식해서 추출한다.
   - `FR03-4`: 사용자가 생성한 스케치를 요약하고 주요 내용을 분석한다.
   - `FR03-5`: 오늘의 추천 스케치를 제공하며, 키즈 모드에서는 적합한 콘텐츠를 제공한다.

4. `FR04`: WebOS 특화 기능
   - `FR04-1`: LS2Request 및 Luna API를 사용하여 CPU 및 메모리 상태를 시각화한다.

---

### 2.2 품질 속성 (Quality Attribute)

1. `QA01`: 성능
   - `QA01-1`: Canvas 작업(Undo/Redo, 이동, 편집)은 0.1초 이하의 응답 속도를 가져야 한다.
   - `QA01-2`: MongoDB와의 데이터 CRUD 작업은 1초 이내에 완료되어야 한다.
   - `QA01-3`: OPENAI 응답 생성 시간은 최대한 빠르게 완료되어야 한다.

2. `QA02`: 보안
   - `QA02-1`: 사용자 계정 데이터는 암호화된 상태로 저장되어야 한다.
   - `QA02-2`: 키즈 모드에서 부적절한 요청은 실시간으로 차단되어야 한다.

3. `QA03`: 신뢰성
   - `QA03-1`: 애플리케이션은 WebOS 환경에서 99.9%의 가용성을 유지해야 한다.
   - `QA03-2`: 스케치 데이터 저장 및 합치기, 불러오기 작업 중 데이터 손실이 없어야 한다.

4. `QA04`: 사용성
   - `QA04-1`: 백그라운드 실행을 지원하여 사용자가 다른 작업 중에도 앱을 종료하지 않고 빠르게 재개할 수 있어야 한다.
   - `QA04-2`: UI는 WebOS Enact Framework 기반으로 직관적이고 간단하게 설계되어야 한다.