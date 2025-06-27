import React, { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // 실제 API 호출 대신 임시 데이터 사용
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: '인셉션',
          year: 2010,
          rating: 8.8,
          genre: 'SF, 액션',
          director: '크리스토퍼 놀란'
        },
        {
          id: 2,
          title: '포레스트 검프',
          year: 1994,
          rating: 8.8,
          genre: '드라마',
          director: '로버트 저메키스'
        },
        {
          id: 3,
          title: '타이타닉',
          year: 1997,
          rating: 7.9,
          genre: '로맨스, 드라마',
          director: '제임스 카메론'
        }
      ].filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
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
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="영화 제목이나 감독을 검색해보세요..."
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
              {searchResults.map(movie => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p className="movie-details">
                      <span className="year">{movie.year}</span>
                      <span className="rating">⭐ {movie.rating}</span>
                      <span className="genre">{movie.genre}</span>
                    </p>
                    <p className="director">감독: {movie.director}</p>
                  </div>
                  <button className="recommend-button">
                    추천받기
                  </button>
                </div>
              ))}
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