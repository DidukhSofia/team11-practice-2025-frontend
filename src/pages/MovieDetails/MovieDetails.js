import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetails.css";
import { format, parseISO, addDays } from "date-fns";
import { uk } from "date-fns/locale";
import { FaStar } from "react-icons/fa";


const MovieDetails = () => {
  const { movieId } = useParams();
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 14);
  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [movie, setMovie] = useState(null);
  const availableDates = [];

  for (let d = today; d <= thirtyDaysFromNow; d = addDays(d, 1)) {
    availableDates.push(format(d, "yyyy-MM-dd"));
  }

  useEffect(() => {
    fetch("/Get_All.json")
      .then((response) => response.json())
      .then((data) => {
        const foundMovie = data.movies.find((m) => m.id.toString() === movieId);
        if (!foundMovie) {
          setMovie(null);
          return;
        }
  
        // Отримуємо жанри за ID
        const movieGenres = foundMovie.genres.map((genreId) => 
          data.genres.find((g) => g.id === genreId)?.name || "Невідомий жанр"
        );
  
        // Отримуємо акторів за ID
        const movieActors = foundMovie.actors.map((actorId) => 
          data.actors.find((a) => a.id === actorId)?.name || "Невідомий актор"
        );
  
        const movieDirector = data.directors.find((d) => d.id === foundMovie.directorId)?.name || "Невідомий режисер";
        const movieSessions = data.sessions.filter((session) => session.movieId === foundMovie.id);
  
        setMovie({
          ...foundMovie,
          genres: movieGenres,
          actors: movieActors,
          director: movieDirector,
          sessions: movieSessions, // Додаємо список сеансів
        });
      })
      .catch((error) => console.error("Error fetching movie data:", error));
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
              {movie.genres.join(", ")}
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
              {movie.actors.join(", ")}
            </p>
            <p className="main__description">{movie.description}</p>
            <p className="main__director">
              <strong>Режисер: </strong>
              {movie.director}
            </p>
            <div className="main__button">
              <a href={movie.trailer} className="main__button main__button-right">
                Дивитися трейлер
              </a>
            </div>
          </div>
          <div className="main__content-image">
            <div className="main__poster">
              <img src={movie.posterPath} alt="Movie Poster"/>
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
              {movie.sessions &&
                movie.sessions
                  .filter((session) => session.startTime.split("T")[0] === selectedDate)
                  .map((session) => (
                    <div key={session.id} className="session">
                    <Link
                      to={`/session/${session.id}/hall/${session.hallId}`} // Динамічний шлях
                      className="session__time-link"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {format(parseISO(session.startTime), "HH:mm")}
                    </Link>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
