import React, { useState } from 'react';
import SearchModal from './components/SearchModal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Finder</h1>
        <p>영화를 검색하고 정보를 찾아보세요</p>
        <button className="search-button" onClick={openModal}>
          영화 검색하기
        </button>
      </header>
      
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
}

export default App; 