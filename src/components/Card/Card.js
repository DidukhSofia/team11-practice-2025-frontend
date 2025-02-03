import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ card }) => {
  return (
    <div className="movie-card">
      <Link to={`/movies/${card.id}`} className="movie__content-box-link">
        <div className="movie__content-box">
          <img
            src={card.posterPath}
            alt={card.filmName}
            className="movie-poster"
          />
          <div className="movie__content-text">
            <div className="movie-details">
              <h2 className="movie-title">{card.filmName}</h2>
              <div className="movie-rating">Rating: {card.voteAverage}</div>
              <p className="movie-genres">
                Genres: {card.genres.map((g) => g.name).join(", ")}
              </p>
              <p className="movie-actors">
                Actors: {card.actors.map((a) => a.name).join(", ")}
              </p>
              <Link to={`/movies/${card.id}`} className="movie-info-button">
                More info
              </Link>
            </div>

            <div className="movie-sessions">
              {card.sessions.map((session, index) => (
                <Link key={index} to={`/session/${session.id}`} className="session-time-link">
                  <span className="session-time">
                    {new Date(session.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
