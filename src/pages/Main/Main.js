import React, { useEffect, useState } from "react";
import "./Main.css";
import { Link } from "react-router-dom";
import Background from "../../images/main-bg.png";
import MainCard from "../../components/MainCard/MainCard";

function LuxCinema() {
  return (
    <div className="LuxCinema">
      <div className="LuxCinema__bg">
        <img src={Background} alt="Main Background" className="Background-image" />
        <Link to={`/movies`} className="main-link-button">
          <p className="main-button">ЗАРАЗ У КІНО</p>
        </Link>
      </div>
      <h2 className="LuxCinema-title">НОВИНКИ</h2>
    </div>
  );
}

const Main = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:5273/api/Movie", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => setMovies(data)) // Очікується, що бекенд поверне масив фільмів
      .catch(error => console.error("Error fetching movies:", error));
  }, []);

  return (
    <section className="Main">
      <LuxCinema />
      <div className="movies-container">
        {movies.map((movie) => (
          <MainCard key={movie.id} mainCard={movie} />
        ))}
      </div>
    </section>
  );
};

export default Main;
