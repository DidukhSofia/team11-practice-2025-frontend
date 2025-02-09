import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO} from "date-fns";
import "./Card.css";
import { FaStar } from "react-icons/fa";

const Card = ({ card, selectedDate }) => {
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Fetch actors, genres, and sessions from the API inside useEffect
  useEffect(() => {
    fetch("/Get_All.json") // Use the correct path for your API
      .then(response => response.json())
      .then(data => {
        setActors(data.actors);
        setGenres(data.genres);
        setSessions(data.sessions); // Assuming sessions are included in the response
      })
      .catch(error => console.error("Error fetching actors, genres, and sessions:", error));
  }, []);

  // Get the actor names based on the IDs from card.actors
  const actorNames = card.actors
    .map(id => {
      const actor = actors.find(actor => actor.id === id);
      return actor ? actor.name : null;
    })
    .filter(name => name !== null) // Filter out null values (actors not found)
    .join(", ");

  // Get the genre names based on the IDs from card.genres
  const genresNames = card.genres
    .map(id => {
      const genre = genres.find(genre => genre.id === id);
      return genre ? genre.name : null;
    })
    .filter(name => name !== null) // Filter out null values (genres not found)
    .join(", ");

  // Get the session start times for the selected movie and date
  const filteredSessions = sessions
    .filter(session => session.movieId === card.id) // Only sessions for the selected movie
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
                Genres: {genresNames || "N/A"}
              </p>

              <p className="movie-actors">
                Actors: {actorNames || "N/A"}
              </p>

              <Link to={`/movies/${card.id}`} className="movie-info-button">
                More info
              </Link>
            </div>

            <div className="movie-sessions">
              {filteredSessions.length > 0 ? (
                <div className="session-times">
                  {filteredSessions.map(session => (
                    <div key={session.id} className="session">
                      <Link
                        to={`/session/${session.id}/hall/${session.hallId}`} // Dynamic path
                        className="session__time-link"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {format(parseISO(session.startTime), "HH:mm")}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No sessions available for this movie.</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
