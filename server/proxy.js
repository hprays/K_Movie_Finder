const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY; // .env에서 불러옴
const TMDB_API_KEY = process.env.TMDB_API_KEY; // TMDB API 키

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

// TMDB API를 사용하여 영화 줄거리 검색
app.get('/api/movie-plot', async (req, res) => {
  const { title, year } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'title 파라미터가 필요합니다.' });
  }
  
  try {
    // TMDB 검색 API로 영화 찾기
    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR`;
    if (year) {
      searchUrl += `&year=${year}`;
    }
    
    const searchResponse = await axios.get(searchUrl);
    const movies = searchResponse.data.results;
    
    if (movies && movies.length > 0) {
      // 첫 번째 결과의 상세 정보 가져오기
      const movieId = movies[0].id;
      const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR&append_to_response=credits`;
      
      const detailResponse = await axios.get(detailUrl);
      const movieDetail = detailResponse.data;
      
      res.json({
        plot: movieDetail.overview || '줄거리 정보가 없습니다.',
        poster: movieDetail.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}` : null,
        rating: movieDetail.vote_average,
        releaseDate: movieDetail.release_date,
        runtime: movieDetail.runtime,
        genres: movieDetail.genres ? movieDetail.genres.map(g => g.name) : [],
        director: movieDetail.credits?.crew?.find(person => person.job === 'Director')?.name || null
      });
    } else {
      res.json({ plot: '줄거리 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('TMDB API 오류:', error);
    res.status(500).json({ error: '줄거리 정보를 가져오는 중 오류가 발생했습니다.' });
  }
});

app.listen(5000, () => {
  console.log('프록시 서버 실행 중 (포트 5000)');
});