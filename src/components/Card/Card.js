import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, addHours } from "date-fns";
import "./Card.css";
import { FaStar } from "react-icons/fa";

const Card = ({ card, selectedDate }) => {
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actorsResponse = await fetch("https://localhost:7230/api/Actors");
        const genresResponse = await fetch("https://localhost:7230/api/Genres");
        const sessionsResponse = await fetch("https://localhost:7230/api/Sessions");

        const actorsData = await actorsResponse.json();
        const genresData = await genresResponse.json();
        const sessionsData = await sessionsResponse.json();

        setActors(actorsData);
        setGenres(genresData);
        setSessions(sessionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const actorNames = card.actors
    .map((id) => actors.find((actor) => actor.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const genresNames = card.genres
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const filteredSessions = sessions
    .filter((session) => session.movieId === card.id && session.startTime.startsWith(selectedDate))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <div className="movie-card">
      <Link to={`/movies/${card.id}`} className="movie__content-box-link">
        <div className="movie__content-box">
          <img src={card.posterPath} alt={card.filmName} className="movie-poster" />
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
              <p className="movie-genres">Жанри: {genresNames || "N/A"}</p>
              <p className="movie-actors">Актори: {actorNames || "N/A"}</p>
              <Link to={`/movies/${card.id}`} className="movie-info-button">
                Детальніше
              </Link>
            </div>
            <div className="movie-sessions">
              {filteredSessions.length > 0 ? (
                <div className="session-times">
                  {filteredSessions.map((session) => {
                    const sessionStartTime = parseISO(session.startTime);
                    // Віднімаємо 2 години, щоб отримати час у UTC
                    const adjustedStartTime = addHours(sessionStartTime, -2);

                    return (
                      <div key={session.id} className="session">
                        <Link
                          to={`/session/${session.id}/hall/${session.hallId}`}
                          className="session__time-link"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {/* Форматуємо відкоригований час */}
                          {format(adjustedStartTime, "HH:mm")}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>Немає доступних сеансів.</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
