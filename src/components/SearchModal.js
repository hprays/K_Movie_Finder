import React, { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, searchQuery, searchType }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
              {/* 검색 결과는 다른 담당자가 구현할 예정 */}
              <pre>{JSON.stringify(searchResults, null, 2)}</pre>
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