import React from "react";
import "./Main.css";
import { Link } from "react-router-dom";
import Background from "../../images/main-bg.png";
import MainCard from "../../components/MainCard/MainCard";
import getmovie from "../../Get_All.json"; // Імпортуємо дані з JSON

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
  return (
    <section className="Main">
      <LuxCinema />
      <div className="movies-container">
        {Array.isArray(getmovie.movies) && getmovie.movies.map((movie) => (
          <MainCard key={movie.id} mainCard={movie} />
        ))}
      </div>
    </section>
  );
};

export default Main;
