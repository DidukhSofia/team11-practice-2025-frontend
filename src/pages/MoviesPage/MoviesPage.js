import React, { useState, useEffect } from "react";
import MovieList from "../../components/MovieList/MovieList";
import "./MoviesPage.css";
import Arrow from "../../images/back-arrow.png";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("/Get_All.json") // Завантажуємо дані з публічної папки
      .then((response) => response.json())
      .then((data) => setMovies(data.movies))
      .catch((error) => console.error("Помилка завантаження фільмів:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.filmName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header className="header">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Пошук"
            onChange={handleSearch}
          />
        </div>
      </header>
      <div className="main__movies">
        <div className="movies-page">
          <h1 className="movies-title">Фільми</h1>
          <MovieList movies={filteredMovies} />
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
