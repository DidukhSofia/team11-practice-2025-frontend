import React, { useState, useEffect } from "react";
import MovieList from "../../components/MovieList/MovieList";
import "./MoviesPage.css";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("https://localhost:7230/api/Movie", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => setMovies(data)) // Очікується, що бекенд поверне масив фільмів
      .catch(error => console.error("Error fetching movies:", error));
  }, []);


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.filmName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="movies__page">
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
