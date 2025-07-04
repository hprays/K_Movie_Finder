## 한국영화를 찾는 프로그램 K_Movie_Finder 입니다.

## 사용 방법

### 1. 프록시 서버 실행 (API 키 보호)

```bash
cd server
npm install  # 최초 1회만
npm install express cors axios dotenv
node proxy.js
```

`server/.env` 파일에 KOBIS API 키를 입력
프록시 서버는 5000번 포트에서 실행

### 2. 프론트엔드(React) 실행

```bash
cd ..  # 프로젝트 루트로 이동
npm install  # 최초 1회만
npm start
```

2

### 3. 웹 사용

- 브라우저 [http://localhost:3000](http://localhost:3000) 접속
