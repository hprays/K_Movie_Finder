import React, { useState } from 'react';
import RandomRecommender from './components/RandomRecommender';
import SearchModal from './components/SearchModal';
import MovieDetailModal from './components/MovieDetailModal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [selectedMovieCode, setSelectedMovieCode] = useState('');
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMovieCode('');
    setSelectedMovieTitle('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <RandomRecommender
          onSelectMovie={(movieCd, movieNm) => {
            setSelectedMovieCode(movieCd);
            setSelectedMovieTitle(movieNm);
            setIsDetailModalOpen(true);
          }}
        />
        <h1>Movie Finder</h1>
        <p>영화를 검색하고 정보를 찾아보세요</p>
        <div className="search-container">
          <div className="search-toggle-container">
            <div className="search-toggle">
              <button
                className={`toggle-button ${searchType === 'title' ? 'active' : ''}`}
                onClick={() => setSearchType('title')}
              >
                영화 제목
              </button>
              <button
                className={`toggle-button ${searchType === 'director' ? 'active' : ''}`}
                onClick={() => setSearchType('director')}
              >
                감독 이름
              </button>
            </div>
          </div>

          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder={`${searchType === 'title' ? '영화 제목' : '감독 이름'}을 입력하세요`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="search-submit"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
            >
              검색
            </button>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        searchQuery={searchQuery}
        searchType={searchType}
      />

      <MovieDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        movieCode={selectedMovieCode}
        movieTitle={selectedMovieTitle}
      />
    </div>
  );
}

export default App;