import React, { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('영화 제목');
  
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    
    try {
      let url;
      if (searchType === '영화 제목') {
        url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_API_KEY}&movieNm=${encodeURIComponent(searchTerm)}`;
      } else {
        url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_API_KEY}&directorNm=${encodeURIComponent(searchTerm)}`;
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
    setSearchTerm('');
    setSearchResults([]);
    setSearchType('영화 제목');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎬 영화 검색</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-toggle-container">
            <div className="search-toggle">
              <button
                type="button"
                className={`toggle-button ${searchType === '영화 제목' ? 'active' : ''}`}
                onClick={() => setSearchType('영화 제목')}
              >
                영화제목
              </button>
              <button
                type="button"
                className={`toggle-button ${searchType === '감독명' ? 'active' : ''}`}
                onClick={() => setSearchType('감독명')}
              >
                감독명
              </button>
            </div>
          </div>
          
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchType === '영화 제목' ? '영화 제목을 검색해보세요...' : '감독명을 검색해보세요...'}
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-submit" disabled={isLoading}>
              {isLoading ? '검색 중...' : '검색'}
            </button>
          </div>
        </form>

        <div className="search-results">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>영화를 검색하고 있습니다...</p>
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="results-list">
              {/* 검색 결과는 다른 담당자가 구현할 예정 */}
              <p>검색 결과 {searchResults.length}개</p>
              <pre>{JSON.stringify(searchResults, null, 2)}</pre>
            </div>
          )}

          {!isLoading && searchTerm && searchResults.length === 0 && (
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