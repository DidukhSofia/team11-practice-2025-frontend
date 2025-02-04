import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminPage = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    filmName: "",
    rating:"",
    actors:"",
    genres:"",
    director: "",
    description: "",
    duration: "",
    ageRating: "",
    releaseDate: "",
    posterPath: "",
    backgroundImagePath: "",
    sessions: []
  });

  const [newSession, setNewSession] = useState({
    startTime: "",
    endTime: "",
    price: "",
    hall: "",
  });

  const [editingSession, setEditingSession] = useState(null);
  const [showMovieForm, setShowMovieForm] = useState(false);

  useEffect(() => {
    fetch("/Get_All.json")
      .then((response) => response.json())
      .then((data) => setMovies(data.movies))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleInputChange = (e, isEditing = false, isSession = false) => {
    const { name, value } = e.target;
    if (isSession) {
      if (editingSession) {
        setEditingSession((prev) => ({ ...prev, [name]: value }));
      } else {
        setNewSession((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      if (isEditing) {
        setEditingMovie((prev) => ({ ...prev, [name]: value }));
      } else {
        setNewMovie((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleAddMovie = () => {
    setShowMovieForm(true);
    setEditingMovie(null);
  };

  const handleSaveNewMovie = () => {
    setMovies([...movies, { id: movies.length + 1, ...newMovie }]);
    setNewMovie({
      filmName: "",
      rating:"",
      actors:"",
      genres:"",
      director: "",
      description: "",
      duration: "",
      ageRating: "",
      releaseDate: "",
      posterPath: "",
      backgroundImagePath: "",
      sessions: []
    });
    setShowMovieForm(false);
  };
  // const handleSaveNewMovie = () => {
  //   fetch("https://your-backend-url.com/api/movies", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(newMovie),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setMovies([...movies, data]); // Додаємо отриманий фільм у список
  //       setShowMovieForm(false);
  //       setNewMovie({ /* очистка полів */ });
  //     })
  //     .catch((error) => console.error("Error adding movie:", error));
  // };
  
  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setShowMovieForm(true);
  };

  const handleSaveEdit = () => {
    setMovies(movies.map((movie) => (movie.id === editingMovie.id ? editingMovie : movie)));
    setEditingMovie(null);
    setShowMovieForm(false);
  };

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleAddSessionToNewMovie = () => {
    setNewMovie((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { id: prev.sessions.length + 1, ...newSession }],
    }));
    setNewSession({ startTime: "", endTime: "", price: "", hall: "" });
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
  };

  const handleSaveSessionEdit = () => {
    setEditingMovie((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === editingSession.id ? editingSession : session
      ),
    }));
    setEditingSession(null);
  };
  const handleDeleteSession = (sessionId) => {
    fetch(`http://localhost:5000/sessions/${sessionId}`, {
      method: "DELETE",
    })
      .then(() => {
        setEditingMovie((prev) => ({
          ...prev,
          sessions: prev.sessions.filter((session) => session.id !== sessionId),
        }));
      })
      .catch((error) => console.error("Помилка при видаленні сеансу:", error));
  };
  
  return (
    <div className="admin-panel">
      <h1 className="admin-panel__title">Адмін-панель</h1>
      <button className="admin-panel__button-add"onClick={handleAddMovie}>Додати новий фільм</button>

      <div className="admin-panel__movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="admin-panel__movie-item">
            {movie.posterPath && (
              <img src={movie.posterPath} alt={movie.filmName} className="admin-panel__movie-poster" />
            )}
            <span>{movie.filmName}</span>
            <button className="admin-panel__button-edit" onClick={() => handleEditMovie(movie)}>Редагувати</button>
            <button className=" admin-panel__button-delete" onClick={() => handleDeleteMovie(movie.id)}>Видалити</button>
          </div>
        ))}
      </div>

      {showMovieForm && (
        <div className="admin-panel__movie-form">
          <h3>{editingMovie ? "Редагувати фільм" : "Додати новий фільм"}</h3>
          <input type="text" name="filmName" placeholder="Назва фільму" value={editingMovie ? editingMovie.filmName : newMovie.filmName} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="number" name="rating" placeholder="Рейтинг" value={editingMovie ? editingMovie.voteAverage : newMovie.voteAverage} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="number" name="ageRating" placeholder="Віковий рейтинг" value={editingMovie ? editingMovie.ageRating : newMovie.ageRating} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="number" name="duration" placeholder="Тривалість" value={editingMovie ? editingMovie.duration : newMovie.duration} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="date" name="releaseDate" placeholder="Дата релізу" value={editingMovie ? editingMovie.releaseDate : newMovie.releaseDate} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="text" name="genres" placeholder="Жанр" value={editingMovie ? editingMovie.genres?.map((genre) => genre.name).join(", ") || "" : newMovie.genres }onChange={(e) => handleInputChange(e, !!editingMovie)}/>          
          <input  type="text" name="director" placeholder="Режисер" value={editingMovie ? Array.isArray(editingMovie.director) ? editingMovie.director.map((dir) => dir.name || dir).join(", "): (editingMovie.director?.name || editingMovie.director || ""): newMovie.director }  onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="text" name="actors" placeholder="Актори" value={editingMovie ? editingMovie.actors?.map((actor) => actor.name).join(", ") || "" : newMovie.actors }onChange={(e) => handleInputChange(e, !!editingMovie)}/>          
          <textarea name="description" placeholder="Опис" value={editingMovie ? editingMovie.description : newMovie.description} onChange={(e) => handleInputChange(e, !!editingMovie)}></textarea>
          <input type="text" name="posterPath" placeholder="Посилання на постер" value={editingMovie ? editingMovie.posterPath : newMovie.posterPath} onChange={(e) => handleInputChange(e, !!editingMovie)} />
          <input type="text" name="backgroundImagePath" placeholder="Фонова картинка" value={editingMovie ? editingMovie.backgroundImagePath : newMovie.backgroundImagePath} onChange={(e) => handleInputChange(e, !!editingMovie)} />

          {editingMovie && (
            <div className="admin-panel__sessions-list">
              <h4>Сеанси</h4>
                {editingMovie.sessions.map((session) => (
    <div key={session.id} className="session-item">
      <div className="session-details">
        <span className="session-time">
          {session.startTime} - {session.endTime}
        </span>
        <span className="session-price">{session.price} грн</span>
        <span className="session-hall">Зала: {session.hall}</span>
      </div>
      <div className="session-actions">
        <button className="admin-panel__button-edit" onClick={() => handleEditSession(session)}>Редагувати сеанс</button>
        <button className="admin-panel__button-delete" onClick={() => handleDeleteSession(session.id)}>Видалити</button>

      </div>
    </div>
  ))}
            </div>
          )}

          {!editingMovie && (
            <div className="admin-panel__sessions-list" >
              <h4>Сеанси для нового фільму</h4>
              {newMovie.sessions.map((session) => (
               <div key={session.id} className="session-item">
               <div className="session-details">
                 <span className="session-time">
                   {session.startTime} - {session.endTime}
                 </span>
                 <span className="session-price">{session.price} грн</span>
                 <span className="session-hall">Зала: {session.hall}</span>
               </div> 
               </div> 
              ))
              }
              <div className="admin-panel__sessions-form">
              <input type="datetime-local" class="datetime-start-input" name="startTime" value={newSession.startTime} onChange={(e) => handleInputChange(e, false, true)} />
              <input type="datetime-local" class="datetime-end-input" name="endTime" value={newSession.endTime} onChange={(e) => handleInputChange(e, false, true)} />
                <input type="number" name="price" placeholder="Ціна" value={newSession.price} onChange={(e) => handleInputChange(e, false, true)} />
                <input type="text" name="hall" placeholder="Зала" value={newSession.hall} onChange={(e) => handleInputChange(e, false, true)} />
                <button className="admin-panel__button-add" onClick={handleAddSessionToNewMovie}>Додати сеанс</button>
              </div>
            </div>
          )}

          {editingSession && (
            <div className="admin-panel__sessions-form">
              <h4>Редагувати сеанс</h4>
              <input type="datetime-local" name="startTime" value={editingSession.startTime} onChange={(e) => handleInputChange(e, false, true)} />
              <input type="datetime-local" name="endTime" value={editingSession.endTime} onChange={(e) => handleInputChange(e, false, true)} />
              <input type="number" name="price" placeholder="Ціна" value={editingSession.price} onChange={(e) => handleInputChange(e, false, true)} />
              <input type="text" name="hall" placeholder="Зала" value={editingSession.hall} onChange={(e) => handleInputChange(e, false, true)} />
              <button className="admin-panel__button-save" onClick={handleSaveSessionEdit}>Зберегти сеанс</button>
            </div>
          )}

          <button className="admin-panel__button-save"  onClick={editingMovie ? handleSaveEdit : handleSaveNewMovie}>
            {editingMovie ? "Зберегти" : "Додати фільм"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;