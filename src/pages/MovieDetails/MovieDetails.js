import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetails.css";
import Arrow from "../../images/back-arrow.png";
import { format, parseISO, isWithinInterval, addDays } from "date-fns";
import { uk } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);
  const [selectedDate, setSelectedDate] = useState(today);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch("/Get_All.json")
      .then((response) => response.json())
      .then((data) => {
        const foundMovie = data.movies.find((m) => m.id.toString() === movieId);
        setMovie(foundMovie);
      })
      .catch((error) => console.error("Error fetching movie data:", error));
  }, [movieId]);

  if (!movie) return <div>Фільм не знайдено</div>;

  const uniqueDates = [...new Set(movie.sessions.map((session) => session.startTime.split("T")[0]))]
    .filter((date) => isWithinInterval(parseISO(date), { start: today, end: thirtyDaysFromNow }))
    .sort();

    return (
      <div style={{ backgroundImage: `url(${movie.backgroundImagePath})`, backgroundAttachment: "fixed" }}>
        <div className="main">
          <section className="main_context">
            <div className="main__content-text">
              {/* Movie Info Section */}
              <h1 className="main__title">{movie.filmName}</h1>
              <p className="main__age-rating">{movie.ageRating}+</p>
              <h3 className="main__rating">
                {movie.voteAverage.toFixed(1)} <span className="star">★</span>
              </h3>
              <p className="main__genres">
                <strong>Жанр: </strong>
                {movie.genres.map((genre) => genre.name).join(", ")}
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
                <strong>У головних ролях: </strong>
                {movie.actors.map((actor) => actor.name).join(", ")}
              </p>
              <p className="main__description">{movie.description}</p>
              <p className="main__director">
                <strong>Режисер: </strong>
                {movie.director.name}
              </p>
              <div className="main__button">
                <a href={movie.trailer} className="main__button main__button-right">
                  Дивитися трейлер
                </a>
              </div>
            </div>
            <div className="main__content-image">
              <div className="main__poster">
                <img src={movie.posterPath} />
              </div>
            </div>
          </section>
          <section className="main_schedule">
    <div className="main_schedule-window">
      <h2 className="schedule__title">Розклад сеансів</h2>
  
      {/* Вибір дати */}
      <div className="schedule__calendar">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={today}
          maxDate={thirtyDaysFromNow}
          dateFormat="dd/MM/yyyy"
          locale={uk}
          inline
        />
      </div>
  
      {/* Список сеансів */}
      <div className="schedule__sessions">
        {movie.sessions
          .filter((session) => {
            const sessionDate = session.startTime.split("T")[0];
            return sessionDate === format(selectedDate, "yyyy-MM-dd");
          })
          .map((session) => (
            <div key={session.id} className="session">
              <Link
                to={`/buy-ticket?movieId=${movie.id}&time=${session.startTime}`}
                className="session__time-link"
                onClick={(event) => {
                  event.stopPropagation(); 
                }}>
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
  