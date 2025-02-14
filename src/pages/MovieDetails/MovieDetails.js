import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetails.css";
import { format, parseISO, addDays, addHours } from "date-fns";
import { uk } from "date-fns/locale";
import { FaStar } from "react-icons/fa";

const MovieDetails = () => {
  const { movieId } = useParams();
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 14);
  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [director, setDirector] = useState("");
  const [sessions, setSessions] = useState([]);
  const availableDates = [];

  for (let d = today; d <= thirtyDaysFromNow; d = addDays(d, 1)) {
    availableDates.push(format(d, "yyyy-MM-dd"));
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`http://localhost:5273/api/Movie/${movieId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);

        Promise.all(
          data.genres.map((genreId) =>
            fetch(`http://localhost:5273/api/Genres/${genreId}`)
              .then((res) => res.json())
              .then((genre) => genre.name)
          )
        ).then(setGenres);

        Promise.all(
          data.actors.map((actorId) =>
            fetch(`http://localhost:5273/api/Actors/${actorId}`)
              .then((res) => res.json())
              .then((actor) => actor.name)
          )
        ).then(setActors);

        fetch(`http://localhost:5273/api/Directors/${data.directorId}`)
          .then((res) => res.json())
          .then((director) => setDirector(director.name));
      })
      .catch((error) => console.error("Помилка завантаження фільму:", error));
  }, [movieId]);

  useEffect(() => {
    fetch("http://localhost:5273/api/Sessions")
      .then((res) => res.json())
      .then((data) => {
        const filteredSessions = data.filter((session) => session.movieId === Number(movieId));
        setSessions(filteredSessions);
      })
      .catch((error) => console.error("Помилка завантаження сеансів:", error));
  }, [movieId]);

  if (!movie) return <div>Фільм не знайдено</div>;

  return (
    <div style={{ backgroundImage: `url(${movie.backgroundImagePath})`, backgroundAttachment: "fixed" }}>
      <div className="main">
        <section className="main_context">
          <div className="main__content-text">
            <h1 className="main__title">{movie.filmName}</h1>
            <p className="main__age-rating">{movie.ageRating}+</p>
            <div className="mainCard-rating">
              {Array(Math.round(movie.voteAverage / 2))
                .fill("")
                .map((_, index) => (
                  <FaStar key={index} style={{ color: "red", fontSize: "18px" }} />
                ))}
            </div>
            <p className="main__genres">
              <strong>Жанр: </strong>
              {genres.length > 0 ? genres.join(", ") : "Завантаження..."}
            </p>
            <p className="main__duration">
              <strong>Тривалість: </strong>
              {movie.duration} хв
            </p>
            <p className="main__release-date">
              <strong>Дата релізу: </strong>
              {new Date(movie.releaseDate).toLocaleDateString("uk-UA")}
            </p>
            <p className="main__actors">
              <strong className="main__actors-text">У головних ролях:</strong>
              {actors.length > 0 ? actors.join(", ") : "Завантаження..."}
            </p>
            <p className="main__description">{movie.description}</p>
            <p className="main__director">
              <strong>Режисер: </strong>
              {director ? director : "Завантаження..."}
            </p>
            <div className="main__button">
              <a href={movie.trailer} className="main__button main__button-right">
                Дивитися трейлер
              </a>
            </div>
          </div>
          <div className="main__content-image">
            <div className="main__poster">
              <img src={movie.posterPath} alt="Movie Poster" />
            </div>
          </div>
        </section>
        <section className="main__schedule">
          <h2 className="schedule__title">Розклад сеансів</h2>
          <div className="main__schedule-window">
            <div className="schedule__dropdown">
              <label htmlFor="date-select">Оберіть дату: </label>
              <select
                id="date-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {format(parseISO(date), "dd.MM", { locale: uk })}
                  </option>
                ))}
              </select>
            </div>
            <div className="schedule__sessions">
              {sessions
                .filter((session) => session.startTime.split("T")[0] === selectedDate)
                .map((session) => {
                  const sessionStartTime = parseISO(session.startTime);
                  // Відкоригуємо час на UTC (0 часовий пояс)
                  const adjustedStartTime = addHours(sessionStartTime, -2);  // Віднімемо 2 години (якщо потрібно)

                  return (
                    <div key={session.id} className="session">
                      <Link
                        to={`/session/${session.id}/hall/${session.hallId}`}
                        className="session__time-link"
                      >
                        {/* Форматуємо відкоригований час */}
                        {format(adjustedStartTime, "HH:mm")}
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;