import React from "react";
import { Link } from "react-router-dom";
import "./MainCard.css";
import { FaStar } from "react-icons/fa";

const MainCard = ({ mainCard }) => {
  return (
    <div className="movie-mainCard">
      <div className="mainCard__content-box">
        <img
          src={mainCard.posterPath}
          alt={mainCard.filmName}
          className="mainCard-poster"
        />
        <div className="mainCard__content-overlay">
          <h2 className="mainCard-title">{mainCard.filmName}</h2>
          <div className="mainCard-rating">
            {Array(Math.round(mainCard.voteAverage / 2))
              .fill("")
              .map((_, index) => (
                <FaStar key={index} style={{ color: "red", fontSize: "18px" }} />
              ))}
          </div>
          <div className="mainCard__content-left">
            <p className="mainCard-genres">{mainCard.genres.map((g) => g.name).join(", ")}</p>
            <Link to={`/movies/${mainCard.id}`} className="mainCard-info-button">
                More info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
