import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainCard.css";
import { FaStar } from "react-icons/fa";

const MainCard = ({ mainCard }) => {
  const [actors, setActors] = useState([]);
  
  // Fetch actors from the API inside useEffect of MainCard
  useEffect(() => {
    fetch("/Get_All.json") // Use the correct path for your API
      .then(response => response.json())
      .then(data => setActors(data.actors)) 
      .catch(error => console.error("Error fetching actors:", error));
  }, []);

  // Get the actor names based on the IDs from mainCard.actors
  const actorNames = mainCard.actors
    .map(id => {
      const actor = actors.find(actor => actor.id === id); // Find actor by ID
      return actor ? actor.name : null;  // Return the name if found, otherwise null
    })
    .filter(name => name !== null)  // Filter out null values (actors not found)
    .join(", ");  // Join names with commas

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
            <p className="mainCard-actors">{actorNames}</p> {/* Display actor names */}
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
