import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/dist/css/splide-core.min.css";
import "./Filter.css";
import Card from "../Card/Card";

const Filter = () => {
  const [slides, setSlides] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await fetch("https://localhost:7230/api/Movie");
        const sessionsResponse = await fetch("https://localhost:7230/api/Sessions");
        
        const moviesData = await moviesResponse.json();
        const sessionsData = await sessionsResponse.json();
        
        setMovies(moviesData);
        setSessions(sessionsData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const filteredByDate = movies.filter(movie =>
      sessions.some(session => session.movieId === movie.id && session.startTime.startsWith(selectedDate))
    );
    setFilteredMovies(filteredByDate);
  }, [selectedDate, movies, sessions]);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const formatDisplayDate = (date) => date.toLocaleDateString("en-EN", { day: "numeric", month: "short" });
  const formatDay = (date) => date.toLocaleDateString("en-EN", { weekday: "short" });

  useEffect(() => {
    const generateSlides = (daysCount) => {
      const today = new Date();
      const generatedSlides = [];
      for (let i = 0; i <= daysCount; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        generatedSlides.push({
          date: formatDate(currentDate),
          displayDate: formatDisplayDate(currentDate),
          day: formatDay(currentDate),
        });
      }
      setSlides(generatedSlides);
    };

    generateSlides(14);
  }, []);

  return (
    <div className="filter">
      <Splide
        options={{
          type: "slide",
          perPage: 7,
          perMove: 1,
          arrows: true,
          pagination: false,
          gap: "0.3rem",
          width: 850,
          breakpoints: {
            1100: { perPage: 5, width: 600 },
            950: { perPage: 3, width: 400 },
            600: { perPage: 1, width: 100 },
          },
        }}
        aria-label="Календарний слайдер"
      >
        {slides.map((slide, index) => (
          <SplideSlide key={index}>
            <button
              className="filter__slide"
              onClick={() => setSelectedDate(slide.date)}
            >
              <h3 className="filter__slide-date">{slide.displayDate}</h3>
              <p className="filter__slide-day">{slide.day}</p>
            </button>
          </SplideSlide>
        ))}
      </Splide>

      <Filters movies={movies} setFilteredMovies={setFilteredMovies} selectedDate={selectedDate} sessions={sessions} />

      <div className="movies-list">
        {filteredMovies.map((movie, index) => (
          <Card key={index} card={movie} selectedDate={selectedDate} />
        ))}
      </div>
    </div>
  );
};

function Filters({ movies, setFilteredMovies, selectedDate, sessions }) {
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedGenre: '',
    selectedTime: '',
    selectedActor: ''
  });
  
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    const fetchGenresAndActors = async () => {
      try {
        const genresResponse = await fetch("https://localhost:7230/api/Genres");
        const actorsResponse = await fetch("https://localhost:7230/api/Actors");
        
        const genresData = await genresResponse.json();
        const actorsData = await actorsResponse.json();
        
        setGenres(genresData);
        setActors(actorsData);
      } catch (error) {
        console.error("Error fetching genres and actors:", error);
      }
    };
    
    fetchGenresAndActors();
  }, []);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const applyFilters = (filters) => {
    let filteredMovies = movies.filter(movie =>
      sessions.some(session => session.movieId === movie.id && session.startTime.startsWith(selectedDate))
    );

    if (filters.searchQuery) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.filmName?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.selectedGenre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genres?.some(genre => genre.name === filters.selectedGenre)
      );
    }

    if (filters.selectedTime) {
      filteredMovies = filteredMovies.filter(movie =>
        sessions.some(session => session.movieId === movie.id && session.startTime.startsWith(selectedDate) && session.startTime.split('T')[1] === filters.selectedTime)
      );
    }

    if (filters.selectedActor) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.actors?.some(actor => actor.name === filters.selectedActor)
      );
    }

    setFilteredMovies(filteredMovies);
  };

  const getAvailableTimesForDate = () => {
    return Array.from(new Set(
      sessions.filter(session => session.startTime.startsWith(selectedDate))
        .map(session => session.startTime.split('T')[1])
    ));
  };

  return (
    <div className="filters">
      <div className="filter__search">
        <input
          type="text"
          placeholder="Знайти"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />
      </div>
      <div className="filter__container">
        <select onChange={(e) => handleFilterChange('selectedGenre', e.target.value)}>
          <option value="">Жанр</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>

        <select id="actor-filter" onChange={(e) => handleFilterChange('selectedActor', e.target.value)}>
          <option value="">Актор</option>
          {actors.map((actor) => (
            <option key={actor.id} value={actor.name}>
              {actor.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange('selectedTime', e.target.value)}>
          <option value="">Час</option>
          {getAvailableTimesForDate().map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filter;
