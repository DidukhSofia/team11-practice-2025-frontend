import "./Filter.css";
import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/dist/css/splide-core.min.css";
import "./Filter.css"
import getmovie from "../../Get_All.json";
import Card from "../Card/Card"

const Filter = () => {
  const [slides, setSlides] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    setMovies(getmovie.movies);
    setFilteredMovies(getmovie.movies);
  }, []);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-EN", options);
  };

  const formatDay = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString("en-EN", options);
  };

  useEffect(() => {
    const generateSlides = (daysCount) => {
      const today = new Date();
      const generatedSlides = [];

      for (let i = 0; i <= daysCount; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        generatedSlides.push({
          date: formatDate(currentDate),
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
          type: "loop",
          perPage: 7,
          perMove: 1,
          arrows: true,
          pagination: false,
          gap: "0.3rem",
          width: 850,
          breakpoints: {
            1100: {
              perPage: 5,
              width: 600,
            },
            950: {
              perPage: 3,
              width: 400,
            },
            600:{
              perPage: 1,
              width: 100,
            },
          },
        }}
        aria-label="Calendar Slider"
        onMounted={(splide) => {
          splide.refresh(); // Refresh the slider after it has been mounted
        }}
      >
        {slides.map((slide, index) => (
          <SplideSlide key={index}>
            <button className="filter__slide">
              <h3 className="filter__slide-date">{slide.date}</h3>
              <p className="filter__slide-day">{slide.day}</p>
            </button>
          </SplideSlide>
        ))}
      </Splide>
      <Filters movies={movies} setFilteredMovies={setFilteredMovies} />
        {filteredMovies.map((movie, index) => (
          <Card key={index} card={movie} />
        ))}
    </div>
  );
};


function Filters({ movies, setFilteredMovies }) {
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
          {/* <img src={Search} alt="search" className="loop" /> */}
  
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
            {movies.map((movie, index) => (
              movie.sessions?.map((session, sessionIndex) => (
                <option key={`${index}-${sessionIndex}`} value={session?.startTime?.split('T')[1]}>
                  {session?.startTime?.split('T')[1]}
                </option>
              ))
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
