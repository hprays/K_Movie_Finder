import React, { useState, useEffect } from 'react';
import './RandomRecommender.css';

const GENRES = [
  "액션", "드라마", "코미디", "로맨스", "스릴러",
  "공포", "SF", "판타지", "애니메이션", "다큐멘터리"
];

// 다양한 검색 키워드로 더 많은 영화를 가져오기
const SEARCH_KEYWORDS = [
  "영화", "인기", "최신", "추천", "명작", "클래식", "할리우드", "한국영화", "외국영화"
];

const RandomRecommender = ({ onSelectMovie }) => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movie, setMovie] = useState(null);
  const [moviePoster, setMoviePoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usedMovies, setUsedMovies] = useState(new Set()); // 이미 추천된 영화 추적
  const [allMovies, setAllMovies] = useState([]); // 모든 영화 목록 저장
  const [isExpanded, setIsExpanded] = useState(false); // 접기/펼치기 상태

  // 다양한 키워드로 영화 목록을 가져오는 함수
  const fetchAllMovies = async () => {
    const allMovieLists = [];
    
    for (const keyword of SEARCH_KEYWORDS) {
      try {
        const res = await fetch(`http://localhost:5000/api/search?type=title&query=${encodeURIComponent(keyword)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.movieListResult?.movieList) {
            allMovieLists.push(...data.movieListResult.movieList);
          }
        }
      } catch (error) {
        console.error(`${keyword} 검색 중 오류:`, error);
      }
    }
    
    // 중복 제거 (movieCd 기준)
    const uniqueMovies = allMovieLists.filter((movie, index, self) => 
      index === self.findIndex(m => m.movieCd === movie.movieCd)
    );
    
    setAllMovies(uniqueMovies);
    return uniqueMovies;
  };

  // 포스터가 있는 영화를 우선적으로 선택하는 함수
  const selectMovieWithPoster = async (movieList) => {
    // 랜덤하게 20개 영화를 선택하여 포스터 확인
    const shuffled = [...movieList].sort(() => 0.5 - Math.random());
    const sampleMovies = shuffled.slice(0, 20);
    
    // 포스터 정보를 병렬로 확인
    const posterPromises = sampleMovies.map(async (movie) => {
      try {
        let url = `http://localhost:5000/api/movie-plot?title=${encodeURIComponent(movie.movieNm)}`;
        if (movie.prdtYear) {
          url += `&year=${movie.prdtYear}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        return {
          ...movie,
          hasPoster: !!data.poster,
          posterUrl: data.poster
        };
      } catch (error) {
        return {
          ...movie,
          hasPoster: false,
          posterUrl: null
        };
      }
    });

    const moviesWithPosterInfo = await Promise.all(posterPromises);
    
    // 포스터가 있는 영화들을 우선적으로 선택
    const moviesWithPoster = moviesWithPosterInfo.filter(m => m.hasPoster);
    const moviesWithoutPoster = moviesWithPosterInfo.filter(m => !m.hasPoster);
    
    // 포스터가 있는 영화가 있으면 그 중에서 선택, 없으면 전체에서 선택
    const availableMovies = moviesWithPoster.length > 0 ? moviesWithPoster : moviesWithoutPoster;
    
    // 이미 사용된 영화 제외
    const unusedMovies = availableMovies.filter(m => !usedMovies.has(m.movieCd));
    
    if (unusedMovies.length === 0) {
      // 모든 영화를 사용했다면 리셋
      setUsedMovies(new Set());
      return availableMovies[Math.floor(Math.random() * availableMovies.length)];
    }
    
    const selectedMovie = unusedMovies[Math.floor(Math.random() * unusedMovies.length)];
    
    // 사용된 영화 목록에 추가
    setUsedMovies(prev => new Set([...prev, selectedMovie.movieCd]));
    
    return selectedMovie;
  };

  const fetchRandomMovie = async () => {
    if (!selectedGenre) return;

    setLoading(true);
    setMovie(null);
    setMoviePoster(null);
    setError('');

    try {
      let movieList = allMovies;
      
      // 선택된 장르의 영화만 필터링 (정확히 포함된 장르만)
      movieList = allMovies.filter(m => {
        if (!m.genreAlt) return false;
        return m.genreAlt.split(',').map(g => g.trim()).includes(selectedGenre);
      });
      
      // 장르별 결과가 적으면 전체에서 선택
      if (movieList.length < 10) {
        movieList = allMovies;
      }
      
      if (movieList.length === 0) {
        // 영화 목록이 없으면 새로 가져오기
        movieList = await fetchAllMovies();
      }
      
      if (movieList.length === 0) {
        setError('영화를 찾을 수 없습니다.');
        return;
      }

      const selectedMovie = await selectMovieWithPoster(movieList);
      setMovie(selectedMovie);
      if (selectedMovie.posterUrl) {
        setMoviePoster(selectedMovie.posterUrl);
      }
      
    } catch (err) {
      console.error('추천 실패:', err);
      if (err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setError('추천 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 접기/펼치기 토글
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      // 접을 때 영화 정보 초기화
      setMovie(null);
      setMoviePoster(null);
      setError('');
    }
  };

  // 컴포넌트 마운트 시 영화 목록 초기화
  useEffect(() => {
    fetchAllMovies();
  }, []);

  // 결과가 있을 때 컨테이너 스타일 조정
  const containerStyle = movie ? {
    right: '30px',
    width: '400px',
    transition: 'width 0.3s ease, right 0.3s ease'
  } : {
    right: '30px',
    width: '280px',
    transition: 'width 0.3s ease, right 0.3s ease'
  };

  return (
    <>
      {/* 불투명 배경 - 펼쳐졌을 때만 표시 */}
      {isExpanded && (
        <div className="random-recommender-overlay" onClick={toggleExpanded} />
      )}
      
      <div className={`random-recommender ${isExpanded ? 'expanded' : 'collapsed'}`} style={containerStyle}>
        <div className="recommender-header">
          <h3>랜덤 추천</h3>
          <button className="toggle-button" onClick={toggleExpanded} title={isExpanded ? '접기' : '펼치기'}>
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
        
        {isExpanded && (
          <>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="">장르 선택</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            
            <button 
              onClick={fetchRandomMovie} 
              disabled={!selectedGenre || loading}
              className="recommend-button"
            >
              {loading ? '추천 중...' : '랜덤 추천'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {movie && (
              <div className="recommended-movie">
                <div className="movie-poster">
                  {moviePoster ? (
                    <img src={moviePoster} alt={`${movie.movieNm} 포스터`} />
                  ) : (
                    <div className="no-poster">
                      <span>포스터 없음</span>
                    </div>
                  )}
                </div>
                <div className="movie-content">
                  <p
                    className="movie-title"
                    onClick={() => onSelectMovie(movie.movieCd, movie.movieNm)}
                  >
                    {movie.movieNm}
                  </p>
                  <p className="movie-info">감독: {movie.directors?.map(d => d.peopleNm).join(', ') || '정보 없음'}</p>
                  <p className="movie-info">개봉년도: {movie.prdtYear || '정보 없음'}</p>
                  <p className="movie-info">장르: {selectedGenre}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RandomRecommender;
