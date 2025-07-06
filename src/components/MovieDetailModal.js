import React, { useState, useEffect } from 'react';
import './MovieDetailModal.css';

const MovieDetailModal = ({ isOpen, onClose, movieCode, movieTitle }) => {
  const [movieDetail, setMovieDetail] = useState(null);
  const [plotInfo, setPlotInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlotLoading, setIsPlotLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 영화 상세 정보 조회
  useEffect(() => {
    if (isOpen && movieCode) {
      fetchMovieDetail();
      fetchMoviePlot();
    }
  }, [isOpen, movieCode]);

  // KOBIS 데이터가 로드된 후 연도 정보로 줄거리 재검색
  useEffect(() => {
    if (movieDetail && movieDetail.prdtYear && !plotInfo) {
      fetchMoviePlotWithYear();
    }
  }, [movieDetail, plotInfo]);

  const fetchMovieDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `http://localhost:5000/api/movie-detail?movieCode=${movieCode}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.movieInfoResult && data.movieInfoResult.movieInfo) {
        setMovieDetail(data.movieInfoResult.movieInfo);
      } else {
        setError('영화 상세 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('영화 상세 정보 조회 중 오류 발생:', error);
      setError('영화 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoviePlot = async () => {
    if (!movieTitle) return;
    
    setIsPlotLoading(true);
    try {
      // movieDetail이 로드되기를 기다리지 않고 바로 줄거리 요청
      const url = `http://localhost:5000/api/movie-plot?title=${encodeURIComponent(movieTitle)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.plot && data.plot !== '줄거리 정보가 없습니다.' && data.plot !== '줄거리 정보를 찾을 수 없습니다.') {
        setPlotInfo(data);
      }
    } catch (error) {
      console.error('줄거리 정보 조회 중 오류 발생:', error);
    } finally {
      setIsPlotLoading(false);
    }
  };

  const fetchMoviePlotWithYear = async () => {
    if (!movieTitle || !movieDetail?.prdtYear) return;
    
    try {
      const url = `http://localhost:5000/api/movie-plot?title=${encodeURIComponent(movieTitle)}&year=${movieDetail.prdtYear}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.plot && data.plot !== '줄거리 정보가 없습니다.' && data.plot !== '줄거리 정보를 찾을 수 없습니다.') {
        setPlotInfo(data);
      }
    } catch (error) {
      console.error('연도별 줄거리 정보 조회 중 오류 발생:', error);
    }
  };

  const handleClose = () => {
    setMovieDetail(null);
    setPlotInfo(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay detail-modal-overlay" onClick={handleClose}>
      <div
        className="modal-content detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🎬 {movieTitle || '영화 상세 정보'}</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="movie-detail-content">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>영화 상세 정보를 불러오고 있습니다...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {movieDetail && !isLoading && (
            <div className="detail-info">
              {/* 줄거리 섹션 */}
              {plotInfo && (
                <div className="detail-section plot-section">
                  <h3>📖 줄거리</h3>
                  <div className="plot-content">
                    {plotInfo.poster && (
                      <div className="movie-poster">
                        <img src={plotInfo.poster} alt={`${movieTitle} 포스터`} />
                      </div>
                    )}
                    <div className="plot-text">
                      <p>{plotInfo.plot}</p>
                      {plotInfo.rating && (
                        <div className="plot-meta">
                          <span className="rating">⭐ {plotInfo.rating.toFixed(1)}</span>
                          {plotInfo.runtime && (
                            <span className="runtime">⏱️ {plotInfo.runtime}분</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isPlotLoading && (
                <div className="plot-loading">
                  <div className="spinner"></div>
                  <p>줄거리 정보를 불러오고 있습니다...</p>
                </div>
              )}

              <div className="detail-section">
                <h3>기본 정보</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>영화명:</strong> {movieDetail.movieNm}
                    {movieDetail.movieNmEn && (
                      <span className="english-title">
                        {' '}
                        ({movieDetail.movieNmEn})
                      </span>
                    )}
                  </div>
                  <div className="detail-item">
                    <strong>제작연도:</strong>{' '}
                    {movieDetail.prdtYear || '정보 없음'}
                  </div>
                  <div className="detail-item">
                    <strong>개봉일:</strong> {movieDetail.openDt || '정보 없음'}
                  </div>
                  <div className="detail-item">
                    <strong>상영시간:</strong>{' '}
                    {movieDetail.showTm
                      ? `${movieDetail.showTm}분`
                      : '정보 없음'}
                  </div>
                  <div className="detail-item">
                    <strong>관람등급:</strong>{' '}
                    {movieDetail.audits && movieDetail.audits.length > 0
                      ? movieDetail.audits
                          .map((audit) => audit.watchGradeNm)
                          .join(', ')
                      : '정보 없음'}
                  </div>
                  <div className="detail-item">
                    <strong>장르:</strong>{' '}
                    {movieDetail.genres && movieDetail.genres.length > 0
                      ? movieDetail.genres
                          .map((genre) => genre.genreNm)
                          .join(', ')
                      : '정보 없음'}
                  </div>
                  <div className="detail-item">
                    <strong>국가:</strong>{' '}
                    {movieDetail.nations && movieDetail.nations.length > 0
                      ? movieDetail.nations
                          .map((nation) => nation.nationNm)
                          .join(', ')
                      : '정보 없음'}
                  </div>
                </div>
              </div>

              {movieDetail.directors && movieDetail.directors.length > 0 && (
                <div className="detail-section">
                  <h3>감독</h3>
                  <div className="people-list">
                    {movieDetail.directors.map((director, idx) => (
                      <div key={idx} className="person-item">
                        <strong>{director.peopleNm}</strong>
                        {director.peopleNmEn && (
                          <span className="english-name">
                            {' '}
                            ({director.peopleNmEn})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movieDetail.actors && movieDetail.actors.length > 0 && (
                <div className="detail-section">
                  <h3>출연진</h3>
                  <div className="people-list">
                    {movieDetail.actors.slice(0, 10).map((actor, idx) => (
                      <div key={idx} className="person-item">
                        <strong>{actor.peopleNm}</strong>
                        {actor.peopleNmEn && (
                          <span className="english-name">
                            {' '}
                            ({actor.peopleNmEn})
                          </span>
                        )}
                        {actor.cast && (
                          <span className="character"> - {actor.cast}</span>
                        )}
                      </div>
                    ))}
                    {movieDetail.actors.length > 10 && (
                      <div className="more-actors">
                        외 {movieDetail.actors.length - 10}명
                      </div>
                    )}
                  </div>
                </div>
              )}

              {movieDetail.companys && movieDetail.companys.length > 0 && (
                <div className="detail-section">
                  <h3>제작사/배급사</h3>
                  <div className="company-list">
                    {movieDetail.companys.map((company, idx) => (
                      <div key={idx} className="company-item">
                        <strong>{company.companyNm}</strong>
                        <span className="company-part">
                          {' '}
                          ({company.companyPartNm})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
