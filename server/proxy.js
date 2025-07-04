const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY; // .env에서 불러옴

app.get('/api/search', async (req, res) => {
  const { query, type } = req.query;
  if (!query || !type) {
    return res.status(400).json({ error: 'query와 type 파라미터가 필요합니다.' });
  }
  try {
    let kobisUrl;
    if (type === 'title') {
      kobisUrl = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${API_KEY}&movieNm=${encodeURIComponent(query)}`;
    } else {
      kobisUrl = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${API_KEY}&directorNm=${encodeURIComponent(query)}`;
    }
    const response = await axios.get(kobisUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API 요청 실패' });
  }
});

app.get('/api/movie-detail', async (req, res) => {
  const { movieCode } = req.query;
  if (!movieCode) {
    return res.status(400).json({ error: 'movieCode 파라미터가 필요합니다.' });
  }
  try {
    const kobisUrl = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${API_KEY}&movieCd=${movieCode}`;
    const response = await axios.get(kobisUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API 요청 실패' });
  }
});

app.listen(5000, () => {
  console.log('프록시 서버 실행 중 (포트 5000)');
});