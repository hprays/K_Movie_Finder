# K_Movie_Finder

한국 영화를 쉽고 빠르게 소개 받을 수 있는 웹 서비스입니다.

---

## 사용자 가이드

### 1. 설치 및 실행

#### 1) 프록시 서버 실행 (API 키 보호)

1. `K_Movie_Finder/server/.env` 파일을 생성하고 아래와 같이 API 키를 입력하세요.
   ```env
   KOBIS_API_KEY=여기에_KOBIS_API_키_입력
   TMDB_API_KEY=여기에_TMDB_API_키_입력
   ```
2. 프록시 서버 설치 및 실행
   ```bash
   cd server
   npm install  # 최초 1회만
   npm install express cors axios dotenv
   node proxy.js
   ```
   - 프록시 서버는 5000번 포트에서 실행됩니다.

#### 2) 프론트엔드(React) 실행

```bash
cd ..  # 프로젝트 루트로 이동
npm install  # 최초 1회만
npm start
```

#### 3) 웹 사용

- 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 2. 주요 기능

- 영화 제목 또는 감독 이름으로 검색
- 무작위 한국영화 추천
- 영화 상세 정보 모달 제공

### 3. 자주 묻는 질문(FAQ)

- **API 키가 없으면 실행이 안 되나요?**
  - 네, 반드시 KOBIS와 TMDB API 키가 필요합니다.
- **포트 충돌이 날 때는?**
  - 5000, 3000 포트가 비어있는지 확인하세요.

---

## 🛠️ 개발자 가이드

### 1. 폴더 구조

```
K_Movie_Finder/
├── public/                # 정적 파일 (index.html 등)
├── src/                   # 프론트엔드 React 소스
│   ├── components/        # UI 컴포넌트 (검색, 모달 등)
│   ├── App.js             # 메인 앱 컴포넌트
│   └── index.js           # 엔트리 포인트
├── server/                # 백엔드 프록시 서버 (Express)
│   ├── proxy.js           # API 프록시 서버 코드
│   └── .env               # API 키 환경 변수 파일 (직접 생성 필요)
├── package.json           # 프로젝트 메타/스크립트
└── README.md              # 설명서
```

### 2. 주요 파일 설명

- `src/components/` : 검색 모달, 영화 상세 모달 등 UI 컴포넌트
- `server/proxy.js` : 외부 API 키 보호용 프록시 서버 (KOBIS, TMDB)
- `.env` : API 키 저장 (절대 커밋 금지)

### 3. 환경 변수

- `server/.env`에 반드시 API 키를 입력해야 정상 동작

### 4. 기여 방법

1. 이슈/PR 등록 후 작업 권장
2. 커밋 메시지는 명확하게 작성
3. 코드 스타일은 기존 코드와 일관성 유지

---
