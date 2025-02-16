import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainCard.css";
import { FaStar } from "react-icons/fa";
const MainCard = ({ mainCard }) => {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7230/api/Actors", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => setActors(data)) 
      .catch(error => console.error("Error fetching actors:", error));
  }, []);

  const actorNames = mainCard.actors
    .map(id => {
      const actor = actors.find(actor => actor.id === id);
      return actor ? actor.name : null;
    })
    .filter(name => name !== null)
    .join(", ");

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
            <p className="mainCard-actors">{actorNames}</p>
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
