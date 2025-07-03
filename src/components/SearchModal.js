import React, { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, searchQuery, searchType }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const yearOptions = [2025, 2020, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1980];
  const [yearFilter, setYearFilter] = useState('');
  const [yearMode, setYearMode] = useState('after');
  
  // KOBIS API 키
  const KOBIS_API_KEY = '347bfdbac8ec4c0bb074c1187ab08348';

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 검색 쿼리가 변경되면 자동으로 검색 실행
  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      performSearch();
    }
  }, [isOpen, searchQuery, searchType]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    try {
      let url;
      if (searchType === 'title') {
        url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_API_KEY}&movieNm=${encodeURIComponent(searchQuery)}`;
      } else {
        url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_API_KEY}&directorNm=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.movieListResult && data.movieListResult.movieList) {
        setSearchResults(data.movieListResult.movieList);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('영화 검색 중 오류 발생:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎬 검색 결과</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="search-results">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>영화를 검색하고 있습니다...</p>
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="results-list">
              <div className="search-info">
                <p><strong>"{searchQuery}"</strong> 검색 결과 {searchResults.length}개</p>
                <p>검색 유형: {searchType === 'title' ? '영화 제목' : '감독 이름'}</p>
              </div>
              <div className="filter-bar">
                <div className="filter-bar-row">
                  <span className="filter-label">개봉연도</span>
                  <div className="year-mode-group">
                    <button
                      className={`year-mode-btn${yearMode === 'after' ? ' selected' : ''}`}
                      onClick={() => setYearMode('after')}
                    >이후</button>
                    <button
                      className={`year-mode-btn${yearMode === 'before' ? ' selected' : ''}`}
                      onClick={() => setYearMode('before')}
                    >이전</button>
                  </div>
                </div>
                <div className="year-btn-group">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      className={`year-btn${yearFilter === String(year) ? ' selected' : ''}`}
                      onClick={() => setYearFilter(String(year))}
                    >
                      {year}
                    </button>
                  ))}
                  <button
                    className={`year-btn${yearFilter === '' ? ' selected' : ''}`}
                    onClick={() => setYearFilter('')}
                  >
                    전체
                  </button>
                </div>
              </div>
              <ul className="movie-list">
                {searchResults
                  .filter(movie => {
                    if (!yearFilter) return true;
                    if (!movie.prdtYear) return false;
                    const movieYear = parseInt(movie.prdtYear);
                    const filterYear = parseInt(yearFilter);
                    if (yearMode === 'after') return movieYear >= filterYear;
                    if (yearMode === 'before') return movieYear <= filterYear;
                    return true;
                  })
                  .map((movie, idx) => (
                    <li key={idx} className="movie-item">
                      <div className="movie-title"><strong>{movie.movieNm}</strong></div>
                      <div className="movie-info">
                        <span>감독: {movie.directors && movie.directors.length > 0 ? movie.directors.map(d => d.peopleNm).join(', ') : '정보 없음'}</span>
                        <span> | 개봉년도: {movie.prdtYear || '정보 없음'}</span>
                        <span> | 장르: {movie.genreAlt || '정보 없음'}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
              <p>다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 