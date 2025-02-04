import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { FaStar } from "react-icons/fa";


const Card = ({ card, selectedDate }) => {
  // Filter sessions by the selected date and sort by start time
  const filteredSessions = card.sessions
    .filter(session => session.startTime.startsWith(selectedDate)) // Only sessions on the selected date
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort sessions by start time

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
              <div className="mainCard-rating">
                {Array(Math.round(card.voteAverage / 2))
                  .fill("")
                  .map((_, index) => (
                    <FaStar key={index} style={{ color: "red", fontSize: "18px" }} />
                  ))}
              </div>
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
              {/* Display sessions that match the selected date */}
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => (
                  <Link key={index} to={`/widget/${session.id}/seatplan`} className="session-time-link">
                    <span className="session-time">
                      {new Date(session.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Link>
                ))
              ) : (
                <p>No sessions available for this date.</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
