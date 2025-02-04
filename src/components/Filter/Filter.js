import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/dist/css/splide-core.min.css";
import "./Filter.css";
import getmovie from "../../Get_All.json";
import Card from "../Card/Card";

const Filter = () => {
  const [slides, setSlides] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setMovies(getmovie.movies);
    setFilteredMovies(getmovie.movies);
  }, []);

  // Форматуємо дату для відображення
  const formatDate = (date) => date.toISOString().split("T")[0];

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-EN", { day: "numeric", month: "short" });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString("en-EN", { weekday: "short" });
  };

  // Генеруємо дати для слайдера
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

  // Фільтрація за обраною датою
  useEffect(() => {
    if (!selectedDate) {
      setFilteredMovies(movies);
      return;
    }

    const filteredByDate = movies.filter((movie) =>
      movie.sessions?.some((session) => session.startTime.startsWith(selectedDate))
    );

    setFilteredMovies(filteredByDate);
  }, [selectedDate, movies]);

  return (
    <div className="filter">
      <Splide
        options={{
          type: "loop",
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

      {/* Передаємо фільтрацію у Filters */}
      <Filters movies={movies} setFilteredMovies={setFilteredMovies} selectedDate={selectedDate} />

      <div className="movies-list">
        {filteredMovies.map((movie, index) => (
          <Card key={index} card={movie} selectedDate={selectedDate} />
        ))}
      </div>
    </div>
  );
};

function Filters({ movies, setFilteredMovies, selectedDate }) {
    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedGenre: '',
        selectedTime: '',
        selectedActor: ''
    });

    // Фільтрація даних
    const handleFilterChange = (filterKey, value) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, [filterKey]: value };
            applyFilters(updatedFilters);
            return updatedFilters;
        });
    };

    const applyFilters = (filters) => {
        let filteredMovies = movies;

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
                movie.sessions?.some(session => session?.startTime?.split('T')[1] === filters.selectedTime)
            );
        }

        if (filters.selectedActor) {
            filteredMovies = filteredMovies.filter(movie =>
                movie.actors?.some(actor => actor.name === filters.selectedActor)
            );
        }

        setFilteredMovies(filteredMovies);
    };

    // Функція для отримання унікальних значень для жанрів, акторів та часу
    const getUniqueValues = (array, key) => {
        const values = [];
        array.forEach(item => {
            if (item[key]) {
                item[key].forEach(value => {
                    if (!values.includes(value.name)) {
                        values.push(value.name);
                    }
                });
            }
        });
        return values;
    };

    // Отримуємо унікальні часи тільки для обраної дати
    const getAvailableTimesForDate = () => {
        if (!selectedDate) return [];

        const times = new Set();

        movies.forEach(movie => {
            movie.sessions?.forEach(session => {
                if (session.startTime.startsWith(selectedDate)) {
                    const sessionTime = session.startTime.split('T')[1];
                    times.add(sessionTime);
                }
            });
        });

        return Array.from(times);
    };

    return (
        <div className="filters">
            <div className="filter__search">
                <input
                    type="text"
                    id="search"
                    placeholder="Знайти"
                    value={filters.searchQuery}
                    onChange={e => handleFilterChange('searchQuery', e.target.value)}
                />
            </div>
            <div className="filter__container">
                <select
                    id="genre-filter"
                    value={filters.selectedGenre}
                    onChange={e => handleFilterChange('selectedGenre', e.target.value)}
                >
                    <option value="">Жанр</option>
                    {getUniqueValues(movies, 'genres').map((genre, index) => (
                        <option key={index} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>

                <select
                    id="time-filter"
                    value={filters.selectedTime}
                    onChange={e => handleFilterChange('selectedTime', e.target.value)}
                >
                    <option value="">Час</option>
                    {getAvailableTimesForDate().map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    ))}
                </select>

                <select
                    id="actor-filter"
                    value={filters.selectedActor}
                    onChange={e => handleFilterChange('selectedActor', e.target.value)}
                >
                    <option value="">Актор</option>
                    {getUniqueValues(movies, 'actors').map((actor, index) => (
                        <option key={index} value={actor}>
                            {actor}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
export default Filter;
