import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminPage = () => {
  
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    filmName: "",
    rating:"",
    actors:"",
    genres:"",
    trailer: "",

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
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);

  const [editingSession, setEditingSession] = useState(null);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [halls, setHalls] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Перевірка токена...");
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Токен відсутній, перенаправляємо на сторінку входу");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Декодований токен:", decoded);

      if (decoded.role !== "Admin") {
        console.log("Користувач НЕ є адміністратором, редирект на головну");
        navigate("/");
      } else {
        console.log("Користувач — адміністратор, показуємо сторінку");
        setUserRole("Admin");
      }
    } catch (error) {
      console.error("Помилка при декодуванні токена:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);
  // useEffect(() => {
  //   fetch("/Get_All.json")
  //     .then((response) => response.json())
  //     .then((data) => setMovies(data.movies))
  //     .catch((error) => console.error("Error fetching movies:", error));
  // }, []);

  useEffect(() => {
    fetch("http://localhost:5273/api/Movie", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'  // Якщо використовуєте куки для автентифікації
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error("Некоректні дані: очікується масив фільмів");
        }
      })
      .catch((error) => console.error("Помилка завантаження фільмів:", error));

      fetch("http://localhost:5273/api/Sessions")
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error("Помилка завантаження сеансів:", error));

    // Завантажуємо зали
    fetch("http://localhost:5273/api/Halls")
      .then((response) => response.json())
      .then((data) => setHalls(data))
      .catch((error) => console.error("Помилка завантаження залів:", error));

    }, []);
  
  
  const handleInputChange = (e, isEditing = false, isSession = false) => {
    const { name, value } = e.target;
    const newValue = name === "movieId" || name === "hallId" ? Number(value) : value; 

    if (isSession) {
      if (editingSession) {
        setEditingSession((prev) => ({ ...prev, [name]: newValue }));
      } else {
        setNewSession((prev) => ({ ...prev, [name]: newValue }));
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
    setNewMovie({
      filmName: "",
      rating: "",
      actors: "",
      trailer: "",
      genres: "",
      director: "",
      description: "",
      duration: "",
      ageRating: "",
      releaseDate: "",
      posterPath: "",
      backgroundImagePath: "",
      voteAverage: "",
      voteCount: "",
      sessions: []
    });
  };
  
  async function fetchOrCreateGenre(name) {
    try {
        const response = await fetch("http://localhost:5273/api/Genres");
        const genres = await response.json();

        let genre = genres.find(g => g.name.toLowerCase() === name.toLowerCase());
        if (genre) return genre.id; // Жанр знайдено

        // Якщо жанру немає, додаємо його
        const createResponse = await fetch("http://localhost:5273/api/Genres", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!createResponse.ok) throw new Error("Не вдалося створити жанр");
        const newGenre = await createResponse.json();
        return newGenre.id;
    } catch (error) {
        console.error("Помилка при роботі з жанрами:", error);
        return null;
    }
}
async function fetchOrCreateActor(name) {
  try {
      const response = await fetch("http://localhost:5273/api/Actors");
      const actors = await response.json();

      let actor = actors.find(a => a.name.toLowerCase() === name.toLowerCase());
      if (actor) return actor.id; // Актор знайдений

      // Якщо актора немає, додаємо його
      const createResponse = await fetch("http://localhost:5273/api/Actors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
      });

      if (!createResponse.ok) throw new Error("Не вдалося створити актора");
      const newActor = await createResponse.json();
      return newActor.id;
  } catch (error) {
      console.error("Помилка при роботі з акторами:", error);
      return null;
  }
}
async function fetchOrCreateDirector(name) {
  try {
      const response = await fetch("http://localhost:5273/api/Directors");
      const directors = await response.json();

      let director = directors.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (director) return director.id; // Якщо режисер знайдений, повертаємо його ID

      // Якщо режисера немає, створюємо нового
      const createResponse = await fetch("http://localhost:5273/api/Directors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
      });

      if (!createResponse.ok) throw new Error("Не вдалося створити режисера");
      const newDirector = await createResponse.json();
      return newDirector.id;
  } catch (error) {
      console.error("Помилка при роботі з режисерами:", error);
      return null;
  }
}
const handleEditMovie = async (movie) => {
  console.log("Редагований фільм:", movie);

  setEditingMovie(movie);

  // Запити для отримання назв жанрів, акторів та режисера за їхніми ID
  const fetchGenres = async () => {
    const response = await fetch("http://localhost:5273/api/Genres");
    const genres = await response.json();
    return movie.genres.map(genreId => genres.find(g => g.id === genreId)?.name || "").join(", ");
  };

  const fetchActors = async () => {
    const response = await fetch("http://localhost:5273/api/Actors");
    const actors = await response.json();
    return movie.actors.map(actorId => actors.find(a => a.id === actorId)?.name || "").join(", ");
  };

  const fetchDirector = async () => {
    const response = await fetch("http://localhost:5273/api/Directors");
    const directors = await response.json();
    const director = directors.find(d => d.id === movie.directorId);
    return director ? director.name : "";
  };

  // Отримуємо всі дані асинхронно
  const [genres, actors, director] = await Promise.all([fetchGenres(), fetchActors(), fetchDirector()]);

  setNewMovie({
    filmName: movie.filmName || "",
    rating: movie.rating || "",
    description: movie.description || "",
    trailer: movie.trailer || "",
    duration: movie.duration || "",
    ageRating: movie.ageRating || "",
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : "",
    posterPath: movie.posterPath || "",
    backgroundImagePath: movie.backgroundImagePath || "",
    voteAverage: movie.voteAverage || "",
    voteCount: movie.voteCount || "",
    genres: genres || "",
    actors: actors || "",
    director: director || "",
    sessions: movie.sessions || []
  });
  
  setShowMovieForm(true);
};
const handleAddGenres = async () => {
  const genresToAdd = newMovie.genres.split(',').map(g => g.trim()); // Розбиваємо на окремі жанри
  const currentGenres = genresToAdd.filter(g => g !== ""); // Очищаємо від порожніх значень

  for (const genreName of currentGenres) {
    // Перевірка, чи вже існує жанр
    const existingGenreId = await fetchOrCreateGenre(genreName);
    if (!existingGenreId) {
      console.log(`Не вдалося знайти або додати жанр: ${genreName}`);
      continue; // Пропускаємо цей жанр, якщо він не був доданий
    }

    // Якщо жанр ще не додано до списку, додаємо його
    if (!newMovie.genres.split(',').map(g => g.trim().toLowerCase()).includes(genreName.toLowerCase())) {
      setNewMovie(prevState => ({
        ...prevState,
        genres: prevState.genres + (prevState.genres ? `, ${genreName}` : genreName),
      }));
      console.log("Жанр успішно додано:", genreName);
    } else {
      console.log("Жанр вже існує:", genreName);
    }
  }
};

const handleAddActor = async () => {
  const actorsToAdd = newMovie.actors.split(',').map(a => a.trim()); // Розбиваємо на окремих акторів
  const currentActors = actorsToAdd.filter(a => a !== ""); // Очищаємо від порожніх значень

  for (const actorName of currentActors) {
    // Перевірка, чи вже існує актор
    const existingActorId = await fetchOrCreateActor(actorName);
    if (!existingActorId) {
      console.log(`Не вдалося знайти або додати актора: ${actorName}`);
      continue; // Пропускаємо цього актора, якщо він не був доданий
    }

    // Якщо актор ще не доданий до списку, додаємо його
    if (!newMovie.actors.split(',').map(a => a.trim().toLowerCase()).includes(actorName.toLowerCase())) {
      setNewMovie(prevState => ({
        ...prevState,
        actors: prevState.actors + (prevState.actors ? `, ${actorName}` : actorName),
      }));
      console.log("Актор успішно додано:", actorName);
    } else {
      console.log("Актор вже існує:", actorName);
    }
  }
};

const handleAddDirector = async () => {
  const directorName = newMovie.director.trim();
  if (!directorName) return; // Якщо режисер не вказаний

  // Перевірка, чи вже існує режисер
  const existingDirectorId = await fetchOrCreateDirector(directorName);
  if (!existingDirectorId) {
    console.log(`Не вдалося знайти або додати режисера: ${directorName}`);
    return;
  }

  // Якщо режисер ще не доданий, додаємо його
  if (newMovie.director.toLowerCase() !== directorName.toLowerCase()) {
    setNewMovie(prevState => ({
      ...prevState,
      director: directorName,
    }));
    console.log("Режисер успішно додано:", directorName);
  } else {
    console.log("Режисер вже існує:", directorName);
  }
};

  const handleSaveNewMovie = async () => {
    try {
      const genreNames = typeof newMovie.genres === "string" ? newMovie.genres.split(',').map(g => g.trim()) : [];
      const actorNames = typeof newMovie.actors === "string" ? newMovie.actors.split(',').map(a => a.trim()) : [];
      const directorName = typeof newMovie.director === "string" ? newMovie.director.trim() : "";
  
      // Отримуємо ID для жанрів, акторів та режисера
      const genreIds = await Promise.all(genreNames.map(name => fetchOrCreateGenre(name)));
      const actorIds = await Promise.all(actorNames.map(name => fetchOrCreateActor(name)));
      const directorId = directorName ? await fetchOrCreateDirector(directorName) : null;
  
      // Формуємо об'єкт фільму для запиту
      const formattedMovie = {
        
        filmName: newMovie.filmName || "",
        rating: newMovie.rating || "",
        description: newMovie.description || "",
        trailer: newMovie.trailer || "",
        duration: parseInt(newMovie.duration) || 0,
        ageRating: parseInt(newMovie.ageRating) || 0,
        posterPath: newMovie.posterPath || "",
        backgroundImagePath: newMovie.backgroundImagePath || "",
        voteAverage: parseFloat(newMovie.voteAverage) || 0,
        voteCount: parseInt(newMovie.voteCount) || 0,
        genres: genreIds,
        actors: actorIds,
        directorId: directorId,
        sessions: newMovie.sessions || []
      };
  
      if (newMovie.releaseDate && newMovie.releaseDate.trim()) {
        formattedMovie.releaseDate = new Date(newMovie.releaseDate).toISOString();
      }
  
      // **ДОДАВАННЯ НОВОГО ФІЛЬМУ (POST)**
      const response = await fetch("http://localhost:5273/api/Movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedMovie)
      });
  
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
  
      // Оновлення списку фільмів
      setMovies(prevMovies => [...prevMovies, data]);
  
      // Очистка форми
      setNewMovie({
        filmName: "",
        rating: "",
        actors: "",
        genres: "",
        trailer: "",
        director: "",
        description: "",
        duration: "",
        ageRating: "",
        releaseDate: "",
        posterPath: "",
        backgroundImagePath: "",
        voteAverage: "",
        voteCount: "",
        sessions: []
      });
  
      setShowMovieForm(false);
  
    } catch (error) {
      console.error("Помилка збереження фільму:", error);
    }
  };     

  const handleSaveEdit = async () => {
    try {
      const genreNames = newMovie.genres.split(',').map(g => g.trim());
      const actorNames = newMovie.actors.split(',').map(a => a.trim());
      const directorName = newMovie.director.trim();
  
      // Отримуємо ID для жанрів, акторів та режисера
      const genreIds = await Promise.all(genreNames.map(name => fetchOrCreateGenre(name)));
      const actorIds = await Promise.all(actorNames.map(name => fetchOrCreateActor(name)));
      const directorId = await fetchOrCreateDirector(directorName);
  
      const formattedMovie = {
        id: editingMovie.id,  // Переконатись, що id фільму передається
        filmName: newMovie.filmName || "",
        description: newMovie.description || "",
        trailer: newMovie.trailer || "",
        duration: parseInt(newMovie.duration) || 0,
        ageRating: parseInt(newMovie.ageRating) || 0,
        posterPath: newMovie.posterPath || "",
        backgroundImagePath: newMovie.backgroundImagePath || "",
        voteAverage: parseFloat(newMovie.voteAverage) || 0,
        voteCount: parseInt(newMovie.voteCount) || 0,
        genres: genreIds.length ? genreIds : [0], // Мінімально допустиме значення
        actors: actorIds.length ? actorIds : [0], // Мінімально допустиме значення
        directorId: parseInt(directorId) || 0,
        releaseDate: newMovie.releaseDate ? new Date(newMovie.releaseDate).toISOString() : new Date().toISOString(),
      };
  
      const response = await fetch(`http://localhost:5273/api/Movie/${editingMovie.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedMovie),
      });
  
      const responseText = await response.text();
      if (responseText.trim()) {
        const updatedMovie = JSON.parse(responseText);
        setMovies(movies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie)));
        setEditingMovie(null); // Закриваємо форму
        setShowMovieForm(false); // Якщо є стан, який відповідає за показ форми
      } else {
        throw new Error("Сервер не надіслав коректні дані.");
      }
    } catch (e) {
      console.error("Помилка при парсингу JSON:", e);
    }
  };
  
  const handleDeleteMovie = (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей фільм?")) {
      fetch(`http://localhost:5273/api/Movie/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setMovies(movies.filter((movie) => movie.id !== id));
          } else {
            console.error("Не вдалося видалити фільм. Статус: ", response.status);
          }
        })
        .catch((error) => console.error("Помилка при видаленні фільму:", error));
    }
  };
  async function fetchOrCreateHall(name) {
    try {
        // Отримуємо список всіх залів
        const response = await fetch("http://localhost:5273/api/Halls");
        const halls = await response.json();
  
        // Шукаємо зал за назвою (регістр не враховується)
        let hall = halls.find(h => h.name.toLowerCase() === name.toLowerCase());
        if (hall) return hall.id; // Якщо зал знайдений, повертаємо його ID
  
        // Якщо зал не знайдений, створюємо новий
        const createResponse = await fetch("http://localhost:5273/api/Halls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
  
        if (!createResponse.ok) throw new Error("Не вдалося створити зал");
        const newHall = await createResponse.json();
        return newHall.id;
    } catch (error) {
        console.error("Помилка при роботі з залами:", error);
        return null;
    }
  }
  const handleAddSession = async () => {
    try {
      console.log("Нова сесія:", newSession);
  
      if (!newSession.hallId) {
        console.error("Не вказано залу");
        return;
      }
  
      const newSessionData = {
        movieId: newSession.movieId,
        price: parseFloat(newSession.price),
        hallId: newSession.hallId,  // Тепер використовуємо hallId замість hallName
      };
  
      if (newSession.startTime && newSession.startTime.trim() !== "") {
        newSessionData.startTime = new Date(newSession.startTime).toISOString();
      }
      if (newSession.endTime && newSession.endTime.trim() !== "") {
        newSessionData.endTime = new Date(newSession.endTime).toISOString();
      }
  
      console.log("Дані для відправки:", newSessionData);
  
      const response = await fetch("http://localhost:5273/api/Sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSessionData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Помилка при створенні сеансу:", errorText);
        throw new Error("Не вдалося створити сеанс");
      }
  
      // Після створення одразу отримуємо всі актуальні сеанси
      const updatedSessionsResponse = await fetch("http://localhost:5273/api/Sessions");
      const updatedSessions = await updatedSessionsResponse.json();
  
      console.log("Оновлені сеанси:", updatedSessions);
  
      setSessions(updatedSessions); // Оновлюємо список сеансів правильно
  
      setNewSession({ movieId: "", startTime: "", endTime: "", price: "", hallId: "" }); // Очищуємо форму
  
    } catch (error) {
      console.error("Помилка при додаванні сеансу:", error);
    }
  };
  const fromUTCtoLocal = (utcString) => {
    if (!utcString) return "";
    const date = new Date(utcString);
    return date.toISOString().slice(0, 16); // `YYYY-MM-DDTHH:MM`
  };
  
  const handleEditSession = (session) => {
    const movie = movies.find((m) => m.id === session.movieId);
    const hall = halls.find((h) => h.id === session.hallId);
  
    setEditingSession({
      ...session,
      movieId: session.movieId || "",
      hallId: session.hallId || "",
      movieName: movie ? movie.filmName : "",
      hallName: hall ? hall.name : "",
      startTime: fromUTCtoLocal(session.startTime),
      endTime: fromUTCtoLocal(session.endTime),
    });
  };
  const toUTC = (localDateTime) => {
    if (!localDateTime) return null;
    const date = new Date(localDateTime);
    return date.toISOString(); // Генерує формат `YYYY-MM-DDTHH:MM:SS.SSSZ`
  };
  const handleSaveSessionEdit = async () => {
    try {
      const updatedSession = {
        ...editingSession,
        startTime: toUTC(editingSession.startTime),
        endTime: toUTC(editingSession.endTime),
      };
  
      console.log('Оновлені дані для збереження:', updatedSession);
  
      const response = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSession),
      });
  
      console.log('Статус відповіді:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Помилка від сервера:', errorText);
        throw new Error(`Не вдалося оновити сеанс: ${errorText}`);
      }
  
      // Після успішного збереження, запитуємо оновлені дані для цього сеансу
      const updatedSessionResponse = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`);
      if (updatedSessionResponse.ok) {
        const savedSession = await updatedSessionResponse.json();
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === savedSession.id ? savedSession : session
          )
        );
      } else {
        console.error('Не вдалося отримати оновлений сеанс');
      }
  
      setEditingSession(null); // Очистити форму редагування
    } catch (error) {
      console.error("Помилка при редагуванні сеансу:", error);
    }
  };
  
  
  const handleDeleteSession = (sessionId) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей сеанс?")) {

    fetch(`http://localhost:5273/api/Sessions/${sessionId}`, {
      method: "DELETE",
    })
      .then(() => {
        setSessions(sessions.filter(session => session.id !== sessionId));
      })
      .catch((error) => console.error("Помилка при видаленні сеансу:", error));
      };}
  
  return (
    <div className="admin-panel">
      <h1 className="admin-panel__title">Адмін-панель</h1>
      
      <button className="admin-panel__button-add" onClick={handleAddMovie}>
        Додати новий фільм
      </button>
      
      <button className="admin-panel__button-add" onClick={() => setShowSessions(!showSessions)}>
        {showSessions ? "Сховати сеанси" : "Показати сеанси"}
      </button>
  
      {showSessions && (
        <div className="admin-panel__sessions">
          <h3>Список сеансів</h3>
<div className="admin-panel__sessions-list">
  {[...sessions]
    .map((session) => {
      const movie = movies.find((m) => m.id === session.movieId);
      const hall = halls.find((h) => h.id === session.hallId);
      return {
        ...session,
        movieName: movie ? movie.filmName : "Невідомо",
        hallName: hall ? hall.name : "Невідомо",
      };
    })
    .sort((a, b) => a.movieName.localeCompare(b.movieName)) // Сортування за назвою фільму
    .map((session) => (
      <div key={session.id} className="session-item">
        <span><strong>Фільм:</strong> {session.movieName}</span>
        <span><strong>Час:</strong> {session.startTime} - {session.endTime}</span>
        <span><strong>Ціна:</strong> {session.price} грн</span>
        <span><strong>Зала:</strong> {session.hallName}</span>
        <button 
            className="admin-panel__button-edit"
            onClick={() => handleEditSession(session)}
          >
            Редагувати
          </button>

          <button 
className="admin-panel__button-delete"
            onClick={() => handleDeleteSession(session.id)}
          >
            Видалити
            </button>

      </div>
    ))}
</div>
<div className="admin-panel__movie-form">
          {editingSession ? (
            <div className="admin-panel__sessions-form">
              <h3>Редагувати сеанс</h3>

              <select
                name="movieId"
                value={editingSession.movieId}
                onChange={(e) => handleInputChange(e, true, true)}
              >
                <option value="">Оберіть фільм</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.filmName}
                  </option>
                ))}
              </select>

              <select
  name="hallId"
  value={editingSession.hallId }
  onChange={(e) => handleInputChange(e, true, true)}
>
  <option value="">Оберіть залу</option>
  {halls.map((hall) => (
    <option key={hall.id} value={hall.id}>
      {hall.name}
    </option>
  ))}
</select>

              <input
                type="datetime-local"
                name="startTime"
                value={editingSession.startTime || ""}
                onChange={(e) => handleInputChange(e, true, true)}
              />

              <input
                type="datetime-local"
                name="endTime"
                value={editingSession.endTime || ""}
                onChange={(e) => handleInputChange(e, true, true)}
              />

              <input
                type="number"
                name="price"
                value={editingSession.price || ""}
                onChange={(e) => handleInputChange(e, true, true)}
              />

              <button className="admin-panel__button-save"  onClick={handleSaveSessionEdit}>Зберегти зміни</button>
            </div>
          ) : (
            <div className="admin-panel__sessions-form">
              <h3>Додати новий сеанс</h3>

              <select
                name="movieId"
                value={newSession.movieId}
                onChange={(e) => handleInputChange(e, false, true)}
              >
                <option value="">Оберіть фільм</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.filmName}
                  </option>
                ))}
              </select>
              <select
  name="hallId"
  value={newSession.hallId }
  onChange={(e) => handleInputChange(e, true, true)}
>
  <option value="">Оберіть залу</option>
  {halls.map((hall) => (
    <option key={hall.id} value={hall.id}>
      {hall.name}
    </option>
  ))}
</select>
              

              <input
                type="datetime-local"
                name="startTime"
                value={newSession.startTime || ""}
                onChange={(e) => handleInputChange(e, false, true)}
              />

              <input
                type="datetime-local"
                name="endTime"
                value={newSession.endTime || ""}
                onChange={(e) => handleInputChange(e, false, true)}
              />

              <input
                type="number"
                name="price"
                placeholder="Ціна"
                value={newSession.price || ""}
                onChange={(e) => handleInputChange(e, false, true)}
              />

              <button className="admin-panel__button-add" onClick={handleAddSession}>
                Додати сеанс
              </button>
            </div>
          )}
        </div>
      </div>
    
      )}
  
      <div className="admin-panel__movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="admin-panel__movie-item">
            {movie.posterPath && (
              <img src={movie.posterPath} alt={movie.filmName} className="admin-panel__movie-poster" />
            )}
            <span>{movie.filmName}</span>
            <button className="admin-panel__button-edit" onClick={() => handleEditMovie(movie)}>
              Редагувати
            </button>
            <button className="admin-panel__button-delete" onClick={() => handleDeleteMovie(movie.id)}>
              Видалити
            </button>
          </div>
        ))}
      </div>
  
      {showMovieForm && (
        <div className="admin-panel__movie-form">
          <h3>{editingMovie ? "Редагувати фільм" : "Додати новий фільм"}</h3>
  
          <input type="text" name="filmName" placeholder="Назва" value={newMovie.filmName} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Опис" value={newMovie.description} onChange={handleInputChange} />
          <input type="text" name="trailer" placeholder="Трейлер" value={newMovie.trailer} onChange={handleInputChange} />
          <input type="number" name="duration" placeholder="Тривалість" value={newMovie.duration} onChange={handleInputChange} />
          
          <input type="number" name="ageRating" placeholder="Віковий рейтинг" value={newMovie.ageRating} onChange={handleInputChange} />
  
          <input 
            type="date" 
            name="releaseDate" 
            value={newMovie.releaseDate ? new Date(newMovie.releaseDate).toISOString().split('T')[0] : ''} 
            onChange={handleInputChange} 
          />
  
          <input type="text" name="posterPath" placeholder="Постер" value={newMovie.posterPath} onChange={handleInputChange} />
          <input type="text" name="backgroundImagePath" placeholder="Фон" value={newMovie.backgroundImagePath} onChange={handleInputChange} />
          <input type="number" name="voteAverage" placeholder="Рейтинг" value={newMovie.voteAverage} onChange={handleInputChange} />
          <input type="number" name="voteCount" placeholder="Кількість голосів" value={newMovie.voteCount} onChange={handleInputChange} />
          <div className="input-group">
  <input
    type="text"
    name="genres"
    placeholder="Жанри (через кому)"
    value={newMovie.genres}
    onChange={handleInputChange}
  />
          {editingMovie && ( 

      <button className="button-edit" onClick={handleAddGenres}>Редагувати жанр</button>)}
      </div>

<div className="input-group">
  <input
    type="text"
    name="actors"
    placeholder="Актори (через кому)"
    value={newMovie.actors}
    onChange={handleInputChange}
  />
        {editingMovie && ( 
  <button className="button-edit" onClick={handleAddActor}>Редагувати актора</button>)}
</div>

<div className="input-group">
  <input
    type="text"
    name="director"
    placeholder="Режисер"
    value={newMovie.director}
    onChange={handleInputChange}
  />
          {editingMovie && ( 

  <button className="button-edit" onClick={handleAddDirector}>Редагувати режисера</button>)}
</div>


          <button className="admin-panel__button-add" onClick={editingMovie ? handleSaveEdit : handleSaveNewMovie}>
  {editingMovie ? "Зберегти зміни" : "Додати фільм"}
</button>

          <button className="admin-panel__button-add" onClick={() => { setShowMovieForm(false); setEditingMovie(null); }}>
            Скасувати
          </button>
        </div>
      )}
    </div>
  );
  
};

export default AdminPage;

// import React, { useState, useEffect } from "react";
// import "./AdminPage.css";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const AdminPage = () => {
  
//   const [movies, setMovies] = useState([]);
//   const [editingMovie, setEditingMovie] = useState(null);
//   const [newMovie, setNewMovie] = useState({
//     filmName: "",
//     rating:"",
//     actors:"",
//     genres:"",
//     trailer: "",

//     director: "",
//     description: "",
//     duration: "",
//     ageRating: "",
//     releaseDate: "",
//     posterPath: "",
//     backgroundImagePath: "",
//     sessions: []
//   });

//   const [newSession, setNewSession] = useState({
//     startTime: "",
//     endTime: "",
//     price: "",
//     hall: "",
//   });
//   const [sessions, setSessions] = useState([]);
//   const [showSessions, setShowSessions] = useState(false);

//   const [editingSession, setEditingSession] = useState(null);
//   const [showMovieForm, setShowMovieForm] = useState(false);
//   const [halls, setHalls] = useState([]);
//   const [userRole, setUserRole] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     console.log("Перевірка токена...");
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.log("Токен відсутній, перенаправляємо на сторінку входу");
//       navigate("/login");
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       console.log("Декодований токен:", decoded);

//       if (decoded.role !== "Admin") {
//         console.log("Користувач НЕ є адміністратором, редирект на головну");
//         navigate("/");
//       } else {
//         console.log("Користувач — адміністратор, показуємо сторінку");
//         setUserRole("Admin");
//       }
//     } catch (error) {
//       console.error("Помилка при декодуванні токена:", error);
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate]);
//   // useEffect(() => {
//   //   fetch("/Get_All.json")
//   //     .then((response) => response.json())
//   //     .then((data) => setMovies(data.movies))
//   //     .catch((error) => console.error("Error fetching movies:", error));
//   // }, []);

//   useEffect(() => {
//     fetch("http://localhost:5273/api/Movie", {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include'  // Якщо використовуєте куки для автентифікації
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setMovies(data);
//         } else {
//           console.error("Некоректні дані: очікується масив фільмів");
//         }
//       })
//       .catch((error) => console.error("Помилка завантаження фільмів:", error));

//       fetch("http://localhost:5273/api/Sessions")
//       .then((response) => response.json())
//       .then((data) => setSessions(data))
//       .catch((error) => console.error("Помилка завантаження сеансів:", error));

//     // Завантажуємо зали
//     fetch("http://localhost:5273/api/Halls")
//       .then((response) => response.json())
//       .then((data) => setHalls(data))
//       .catch((error) => console.error("Помилка завантаження залів:", error));

//     }, []);
  
  
//   const handleInputChange = (e, isEditing = false, isSession = false) => {
//     const { name, value } = e.target;
//     const newValue = name === "movieId" || name === "hallId" ? Number(value) : value; 

//     if (isSession) {
//       if (editingSession) {
//         setEditingSession((prev) => ({ ...prev, [name]: newValue }));
//       } else {
//         setNewSession((prev) => ({ ...prev, [name]: newValue }));
//       }
//     } else {
//       if (isEditing) {
//         setEditingMovie((prev) => ({ ...prev, [name]: value }));
//       } else {
//         setNewMovie((prev) => ({ ...prev, [name]: value }));
//       }
//     }


//   };
//   const handleAddMovie = () => {
//     setShowMovieForm(true);
//     setEditingMovie(null);
//     setNewMovie({
//       filmName: "",
//       rating: "",
//       actors: "",
//       trailer: "",
//       genres: "",
//       director: "",
//       description: "",
//       duration: "",
//       ageRating: "",
//       releaseDate: "",
//       posterPath: "",
//       backgroundImagePath: "",
//       voteAverage: "",
//       voteCount: "",
//       sessions: []
//     });
//   };
  
//   async function fetchOrCreateGenre(name) {
//     try {
//         const response = await fetch("http://localhost:5273/api/Genres");
//         const genres = await response.json();

//         let genre = genres.find(g => g.name.toLowerCase() === name.toLowerCase());
//         if (genre) return genre.id; // Жанр знайдено

//         // Якщо жанру немає, додаємо його
//         const createResponse = await fetch("http://localhost:5273/api/Genres", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name })
//         });

//         if (!createResponse.ok) throw new Error("Не вдалося створити жанр");
//         const newGenre = await createResponse.json();
//         return newGenre.id;
//     } catch (error) {
//         console.error("Помилка при роботі з жанрами:", error);
//         return null;
//     }
// }
// async function fetchOrCreateActor(name) {
//   try {
//       const response = await fetch("http://localhost:5273/api/Actors");
//       const actors = await response.json();

//       let actor = actors.find(a => a.name.toLowerCase() === name.toLowerCase());
//       if (actor) return actor.id; // Актор знайдений

//       // Якщо актора немає, додаємо його
//       const createResponse = await fetch("http://localhost:5273/api/Actors", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name })
//       });

//       if (!createResponse.ok) throw new Error("Не вдалося створити актора");
//       const newActor = await createResponse.json();
//       return newActor.id;
//   } catch (error) {
//       console.error("Помилка при роботі з акторами:", error);
//       return null;
//   }
// }
// async function fetchOrCreateDirector(name) {
//   try {
//       const response = await fetch("http://localhost:5273/api/Directors");
//       const directors = await response.json();

//       let director = directors.find(d => d.name.toLowerCase() === name.toLowerCase());
//       if (director) return director.id; // Якщо режисер знайдений, повертаємо його ID

//       // Якщо режисера немає, створюємо нового
//       const createResponse = await fetch("http://localhost:5273/api/Directors", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name })
//       });

//       if (!createResponse.ok) throw new Error("Не вдалося створити режисера");
//       const newDirector = await createResponse.json();
//       return newDirector.id;
//   } catch (error) {
//       console.error("Помилка при роботі з режисерами:", error);
//       return null;
//   }
// }
//   const handleEditMovie = async (movie) => {
//     if (!movie) return; // Перевірка, чи є фільм
    
//     try {
//       // Отримуємо дані режисера
//       const directorResponse = await fetch(`http://localhost:5273/api/Directors/${movie.directorId}`);
//       const directorData = await directorResponse.json();
//       const directorName = directorData?.name || "";
  
//       // Отримуємо жанри
//       const genresResponse = await fetch("http://localhost:5273/api/Genres");
//       const genresData = await genresResponse.json();
//       const genreNames = movie.genres.map(id => {
//         const genre = genresData.find(g => g.id === id);
//         return genre ? genre.name : "";
//       }).join(", ");
  
//       // Отримуємо акторів
//       const actorsResponse = await fetch("http://localhost:5273/api/Actors");
//       const actorsData = await actorsResponse.json();
//       const actorNames = movie.actors.map(id => {
//         const actor = actorsData.find(a => a.id === id);
//         return actor ? actor.name : "";
//       }).join(", ");
  
//       // Встановлюємо дані в стан
//       setEditingMovie(movie);
//       setShowMovieForm(true);
  
//       setNewMovie({
//         filmName: movie.filmName || "",
//         rating: movie.rating || "",
//         actors: actorNames,
//         genres: genreNames,
//         trailer: movie.trailer || "",
//         director: directorName,
//         description: movie.description || "",
//         duration: movie.duration || "",
//         ageRating: movie.ageRating || "",
//         releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
//         posterPath: movie.posterPath || "",
//         backgroundImagePath: movie.backgroundImagePath || "",
//         voteAverage: movie.voteAverage || "",
//         voteCount: movie.voteCount || "",
//         sessions: Array.isArray(movie.sessions) ? movie.sessions : []
//       });
//     } catch (error) {
//       console.error("Помилка завантаження даних для редагування:", error);
//     }
//   };
  

// const handleSaveNewMovie = async () => {
//   try {
//     const genreNames = newMovie.genres.split(',').map(g => g.trim());
//     const actorNames = newMovie.actors.split(',').map(a => a.trim());
//     const directorName = newMovie.director.trim();

//     // Отримуємо ID для жанрів, акторів та режисера
//     const genreIds = await Promise.all(genreNames.map(name => fetchOrCreateGenre(name)));
//     const actorIds = await Promise.all(actorNames.map(name => fetchOrCreateActor(name)));
//     const directorId = await fetchOrCreateDirector(directorName);

//     // Формуємо об'єкт фільму для запиту
//     const formattedMovie = {
//       filmName: newMovie.filmName,
//       rating: newMovie.rating,
//       description: newMovie.description,
//       trailer: newMovie.trailer,
//       duration: parseInt(newMovie.duration) || 0,
//       ageRating: parseInt(newMovie.ageRating) || 0,
//       posterPath: newMovie.posterPath,
//       backgroundImagePath: newMovie.backgroundImagePath,
//       voteAverage: parseFloat(newMovie.voteAverage) || 0,
//       voteCount: parseInt(newMovie.voteCount) || 0,
//       genres: genreIds,
//       actors: actorIds,
//       directorId: directorId,
//       sessions: newMovie.sessions
//     };

//     if (newMovie.releaseDate && newMovie.releaseDate.trim() !== "") {
//       formattedMovie.releaseDate = new Date(newMovie.releaseDate).toISOString();
//     }

//     let response;
//     if (editingMovie) {
//       // **ОНОВЛЕННЯ ФІЛЬМУ**
//       response = await fetch(`http://localhost:5273/api/Movie/${editingMovie.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedMovie)
//       });
//     } else {
//       // **ДОДАВАННЯ НОВОГО ФІЛЬМУ**
//       response = await fetch("http://localhost:5273/api/Movie", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedMovie)
//       });
//     }

//     if (!response.ok) throw new Error(await response.text());
//     const data = await response.json();

//     // **Оновлення списку фільмів**
//     setMovies(prevMovies =>
//       editingMovie
//         ? prevMovies.map(m => (m.id === editingMovie.id ? data : m))
//         : [...prevMovies, data]
//     );

//     // **Очищення форми**
//     setNewMovie({
//       filmName: "",
//       rating: "",
//       actors: "",
//       genres: "",
//       trailer: "",
//       director: "",
//       description: "",
//       duration: "",
//       ageRating: "",
//       releaseDate: "",
//       posterPath: "",
//       backgroundImagePath: "",
//       voteAverage: "",
//       voteCount: "",
//       sessions: []
//     });

//     setEditingMovie(null);
//     setShowMovieForm(false);

//   } catch (error) {
//     console.error("Помилка збереження фільму:", error);
//   }
// };const handleSaveEdit = async () => {
//   try {
//     // Перевірка та підготовка жанрів, акторів та режисера
//     const genreNames = editingMovie?.genres?.split(',').map(g => g.trim()) || [];
//     const actorNames = editingMovie?.actors?.split(',').map(a => a.trim()) || [];
//     const directorName = editingMovie?.director?.trim() || "";

//     // Отримуємо або створюємо ID для жанрів, акторів та режисера
//     const genreIds = await Promise.all(genreNames.map(name => name ? fetchOrCreateGenre(name) : null));
//     const actorIds = await Promise.all(actorNames.map(name => name ? fetchOrCreateActor(name) : null));
//     const directorId = directorName ? await fetchOrCreateDirector(directorName) : null;

//     // Формуємо оновлений об'єкт фільму
//     const updatedMovie = {
//       filmName: editingMovie?.filmName || "",
//       rating: editingMovie?.rating || "",
//       description: editingMovie?.description || "",
//       trailer: editingMovie?.trailer || "",
//       duration: parseInt(editingMovie?.duration) || 0,
//       ageRating: parseInt(editingMovie?.ageRating) || 0,
//       posterPath: editingMovie?.posterPath || "",
//       backgroundImagePath: editingMovie?.backgroundImagePath || "",
//       voteAverage: parseFloat(editingMovie?.voteAverage) || 0,
//       voteCount: parseInt(editingMovie?.voteCount) || 0,
//       genres: genreIds.filter(id => id !== null),
//       actors: actorIds.filter(id => id !== null),
//       directorId: directorId,
//       sessions: editingMovie?.sessions || []
//     };

//     if (editingMovie?.releaseDate?.trim()) {
//       updatedMovie.releaseDate = new Date(editingMovie.releaseDate).toISOString();
//     }

//     // Відправка оновлених даних фільму
//     const response = await fetch(`http://localhost:5273/api/Movie/${editingMovie.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedMovie)
//     });

//     if (!response.ok) throw new Error("Не вдалося оновити фільм");
//     const savedMovie = await response.json();

//     // Оновлення списку фільмів у стані
//     setMovies(prevMovies => prevMovies.map(movie => (movie.id === savedMovie.id ? savedMovie : movie)));
//     setEditingMovie(null);
//     setShowMovieForm(false);

//   } catch (error) {
//     console.error("Помилка збереження фільму:", error);
//   }
// };


//   const handleDeleteMovie = (id) => {
//     if (window.confirm("Ви впевнені, що хочете видалити цей фільм?")) {
//       fetch(`http://localhost:5273/api/Movie/${id}`, {
//         method: "DELETE",
//       })
//         .then((response) => {
//           if (response.ok) {
//             setMovies(movies.filter((movie) => movie.id !== id));
//           } else {
//             console.error("Не вдалося видалити фільм. Статус: ", response.status);
//           }
//         })
//         .catch((error) => console.error("Помилка при видаленні фільму:", error));
//     }
//   };async function fetchOrCreateHall(name) {
//     try {
//         // Отримуємо список всіх залів
//         const response = await fetch("http://localhost:5273/api/Halls");
//         const halls = await response.json();
  
//         // Шукаємо зал за назвою (регістр не враховується)
//         let hall = halls.find(h => h.name.toLowerCase() === name.toLowerCase());
//         if (hall) return hall.id; // Якщо зал знайдений, повертаємо його ID
  
//         // Якщо зал не знайдений, створюємо новий
//         const createResponse = await fetch("http://localhost:5273/api/Halls", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name })
//         });
  
//         if (!createResponse.ok) throw new Error("Не вдалося створити зал");
//         const newHall = await createResponse.json();
//         return newHall.id;
//     } catch (error) {
//         console.error("Помилка при роботі з залами:", error);
//         return null;
//     }
//   }
//   const handleAddSession = async () => {
//     try {
//       console.log("Нова сесія:", newSession);
  
//       if (!newSession.hallId) {
//         console.error("Не вказано залу");
//         return;
//       }
  
//       const newSessionData = {
//         movieId: newSession.movieId,
//         price: parseFloat(newSession.price),
//         hallId: newSession.hallId,  // Тепер використовуємо hallId замість hallName
//       };
  
//       if (newSession.startTime && newSession.startTime.trim() !== "") {
//         newSessionData.startTime = new Date(newSession.startTime).toISOString();
//       }
//       if (newSession.endTime && newSession.endTime.trim() !== "") {
//         newSessionData.endTime = new Date(newSession.endTime).toISOString();
//       }
  
//       console.log("Дані для відправки:", newSessionData);
  
//       const response = await fetch("http://localhost:5273/api/Sessions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newSessionData),
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Помилка при створенні сеансу:", errorText);
//         throw new Error("Не вдалося створити сеанс");
//       }
  
//       // Після створення одразу отримуємо всі актуальні сеанси
//       const updatedSessionsResponse = await fetch("http://localhost:5273/api/Sessions");
//       const updatedSessions = await updatedSessionsResponse.json();
  
//       console.log("Оновлені сеанси:", updatedSessions);
  
//       setSessions(updatedSessions); // Оновлюємо список сеансів правильно
  
//       setNewSession({ movieId: "", startTime: "", endTime: "", price: "", hallId: "" }); // Очищуємо форму
  
//     } catch (error) {
//       console.error("Помилка при додаванні сеансу:", error);
//     }
//   };
//   const fromUTCtoLocal = (utcString) => {
//     if (!utcString) return "";
//     const date = new Date(utcString);
//     return date.toISOString().slice(0, 16); // `YYYY-MM-DDTHH:MM`
//   };
  
//   const handleEditSession = (session) => {
//     const movie = movies.find((m) => m.id === session.movieId);
//     const hall = halls.find((h) => h.id === session.hallId);
  
//     setEditingSession({
//       ...session,
//       movieId: session.movieId || "",
//       hallId: session.hallId || "",
//       movieName: movie ? movie.filmName : "",
//       hallName: hall ? hall.name : "",
//       startTime: fromUTCtoLocal(session.startTime),
//       endTime: fromUTCtoLocal(session.endTime),
//     });
//   };
//   const toUTC = (localDateTime) => {
//     if (!localDateTime) return null;
//     const date = new Date(localDateTime);
//     return date.toISOString(); // Генерує формат `YYYY-MM-DDTHH:MM:SS.SSSZ`
//   };
//   const handleSaveSessionEdit = async () => {
//     try {
//       const updatedSession = {
//         ...editingSession,
//         startTime: toUTC(editingSession.startTime),
//         endTime: toUTC(editingSession.endTime),
//       };
  
//       console.log('Оновлені дані для збереження:', updatedSession);
  
//       const response = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedSession),
//       });
  
//       console.log('Статус відповіді:', response.status);
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Помилка від сервера:', errorText);
//         throw new Error(`Не вдалося оновити сеанс: ${errorText}`);
//       }
  
//       // Після успішного збереження, запитуємо оновлені дані для цього сеансу
//       const updatedSessionResponse = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`);
//       if (updatedSessionResponse.ok) {
//         const savedSession = await updatedSessionResponse.json();
//         setSessions((prevSessions) =>
//           prevSessions.map((session) =>
//             session.id === savedSession.id ? savedSession : session
//           )
//         );
//       } else {
//         console.error('Не вдалося отримати оновлений сеанс');
//       }
  
//       setEditingSession(null); // Очистити форму редагування
//     } catch (error) {
//       console.error("Помилка при редагуванні сеансу:", error);
//     }
//   };
  
  
//   const handleDeleteSession = (sessionId) => {
//     if (window.confirm("Ви впевнені, що хочете видалити цей сеанс?")) {

//     fetch(`http://localhost:5273/api/Sessions/${sessionId}`, {
//       method: "DELETE",
//     })
//       .then(() => {
//         setSessions(sessions.filter(session => session.id !== sessionId));
//       })
//       .catch((error) => console.error("Помилка при видаленні сеансу:", error));
//       };}
  
//   return (
//     <div className="admin-panel">
//       <h1 className="admin-panel__title">Адмін-панель</h1>
      
//       <button className="admin-panel__button-add" onClick={handleAddMovie}>
//         Додати новий фільм
//       </button>
      
//       <button className="admin-panel__button-add" onClick={() => setShowSessions(!showSessions)}>
//         {showSessions ? "Сховати сеанси" : "Показати сеанси"}
//       </button>
  
//       {showSessions && (
//         <div className="admin-panel__sessions">
//           <h3>Список сеансів</h3>
// <div className="admin-panel__sessions-list">
//   {[...sessions]
//     .map((session) => {
//       const movie = movies.find((m) => m.id === session.movieId);
//       const hall = halls.find((h) => h.id === session.hallId);
//       return {
//         ...session,
//         movieName: movie ? movie.filmName : "Невідомо",
//         hallName: hall ? hall.name : "Невідомо",
//       };
//     })
//     .sort((a, b) => a.movieName.localeCompare(b.movieName)) // Сортування за назвою фільму
//     .map((session) => (
//       <div key={session.id} className="session-item">
//         <span><strong>Фільм:</strong> {session.movieName}</span>
//         <span><strong>Час:</strong> {session.startTime} - {session.endTime}</span>
//         <span><strong>Ціна:</strong> {session.price} грн</span>
//         <span><strong>Зала:</strong> {session.hallName}</span>
//         <button 
//             className="admin-panel__button-edit"
//             onClick={() => handleEditSession(session)}
//           >
//             Редагувати
//           </button>

//           <button 
// className="admin-panel__button-delete"
//             onClick={() => handleDeleteSession(session.id)}
//           >
//             Видалити
//             </button>

//       </div>
//     ))}
// </div>
// <div className="admin-panel__movie-form">
//           {editingSession ? (
//             <div className="admin-panel__sessions-form">
//               <h3>Редагувати сеанс</h3>

//               <select
//                 name="movieId"
//                 value={editingSession.movieId}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               >
//                 <option value="">Оберіть фільм</option>
//                 {movies.map((movie) => (
//                   <option key={movie.id} value={movie.id}>
//                     {movie.filmName}
//                   </option>
//                 ))}
//               </select>

//               <select
//   name="hallId"
//   value={editingSession.hallId }
//   onChange={(e) => handleInputChange(e, true, true)}
// >
//   <option value="">Оберіть залу</option>
//   {halls.map((hall) => (
//     <option key={hall.id} value={hall.id}>
//       {hall.name}
//     </option>
//   ))}
// </select>

//               <input
//                 type="datetime-local"
//                 name="startTime"
//                 value={editingSession.startTime || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <input
//                 type="datetime-local"
//                 name="endTime"
//                 value={editingSession.endTime || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <input
//                 type="number"
//                 name="price"
//                 value={editingSession.price || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <button className="admin-panel__button-save"  onClick={handleSaveSessionEdit}>Зберегти зміни</button>
//             </div>
//           ) : (
//             <div className="admin-panel__sessions-form">
//               <h3>Додати новий сеанс</h3>

//               <select
//                 name="movieId"
//                 value={newSession.movieId}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               >
//                 <option value="">Оберіть фільм</option>
//                 {movies.map((movie) => (
//                   <option key={movie.id} value={movie.id}>
//                     {movie.filmName}
//                   </option>
//                 ))}
//               </select>
//               <select
//   name="hallId"
//   value={newSession.hallId }
//   onChange={(e) => handleInputChange(e, true, true)}
// >
//   <option value="">Оберіть залу</option>
//   {halls.map((hall) => (
//     <option key={hall.id} value={hall.id}>
//       {hall.name}
//     </option>
//   ))}
// </select>
              

//               <input
//                 type="datetime-local"
//                 name="startTime"
//                 value={newSession.startTime || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <input
//                 type="datetime-local"
//                 name="endTime"
//                 value={newSession.endTime || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Ціна"
//                 value={newSession.price || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <button className="admin-panel__button-add" onClick={handleAddSession}>
//                 Додати сеанс
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
    
//       )}
  
//       <div className="admin-panel__movie-list">
//         {movies.map((movie) => (
//           <div key={movie.id} className="admin-panel__movie-item">
//             {movie.posterPath && (
//               <img src={movie.posterPath} alt={movie.filmName} className="admin-panel__movie-poster" />
//             )}
//             <span>{movie.filmName}</span>
//             <button className="admin-panel__button-edit" onClick={() => handleEditMovie(movie)}>
//               Редагувати
//             </button>
//             <button className="admin-panel__button-delete" onClick={() => handleDeleteMovie(movie.id)}>
//               Видалити
//             </button>
//           </div>
//         ))}
//       </div>
  
//       {showMovieForm && (
//         <div className="admin-panel__movie-form">
//           <h3>{editingMovie ? "Редагувати фільм" : "Додати новий фільм"}</h3>
  
//           <input type="text" name="filmName" placeholder="Назва" value={newMovie.filmName} onChange={handleInputChange} />
//           <input type="text" name="description" placeholder="Опис" value={newMovie.description} onChange={handleInputChange} />
//           <input type="text" name="trailer" placeholder="Трейлер" value={newMovie.trailer} onChange={handleInputChange} />
//           <input type="number" name="duration" placeholder="Тривалість" value={newMovie.duration} onChange={handleInputChange} />
//           <input type="number" name="ageRating" placeholder="Віковий рейтинг" value={newMovie.ageRating} onChange={handleInputChange} />
  
//           <input 
//             type="date" 
//             name="releaseDate" 
//             value={newMovie.releaseDate ? new Date(newMovie.releaseDate).toISOString().split('T')[0] : ''} 
//             onChange={handleInputChange} 
//           />
  
//           <input type="text" name="posterPath" placeholder="Постер" value={newMovie.posterPath} onChange={handleInputChange} />
//           <input type="text" name="backgroundImagePath" placeholder="Фон" value={newMovie.backgroundImagePath} onChange={handleInputChange} />
//           <input type="number" name="voteAverage" placeholder="Рейтинг" value={newMovie.voteAverage} onChange={handleInputChange} />
//           <input type="number" name="voteCount" placeholder="Кількість голосів" value={newMovie.voteCount} onChange={handleInputChange} />
//           <input type="text" name="genres" placeholder="Жанри (через кому)" value={newMovie.genres} onChange={handleInputChange} />
//           <input type="text" name="actors" placeholder="Актори (через кому)" value={newMovie.actors} onChange={handleInputChange} />
//           <input type="text" name="director" placeholder="Режисер" value={newMovie.director} onChange={handleInputChange} />
  
//           <button className="admin-panel__button-save" onClick={editingMovie ? handleSaveEdit : handleSaveNewMovie}>
//             {editingMovie ? "Зберегти зміни" : "Додати фільм"}
//           </button>
  
//           <button className="admin-panel__button-cancel" onClick={() => { setShowMovieForm(false); setEditingMovie(null); }}>
//             Скасувати
//           </button>
//         </div>
//       )}
//     </div>
//   );
  
// };

// export default AdminPage;
// import React, { useState, useEffect } from "react";
// import "./AdminPage.css";

// const AdminPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [editingMovie, setEditingMovie] = useState(null);
//   const [newMovie, setNewMovie] = useState({
//     filmName: "",
//     rating:"",
//     actors:"",
//     genres:"",
//     trailer: "",

//     director: "",
//     description: "",
//     duration: "",
//     ageRating: "",
//     releaseDate: "",
//     posterPath: "",
//     backgroundImagePath: "",
//     sessions: []
//   });

//   const [newSession, setNewSession] = useState({
//     startTime: "",
//     endTime: "",
//     price: "",
//     hall: "",
//   });
//   const [sessions, setSessions] = useState([]);
//   const [showSessions, setShowSessions] = useState(false);

//   const [editingSession, setEditingSession] = useState(null);
//   const [showMovieForm, setShowMovieForm] = useState(false);
//   const [halls, setHalls] = useState([]);

//   // useEffect(() => {
//   //   fetch("/Get_All.json")
//   //     .then((response) => response.json())
//   //     .then((data) => setMovies(data.movies))
//   //     .catch((error) => console.error("Error fetching movies:", error));
//   // }, []);
//   const token = localStorage.getItem("token"); // Отримуємо токен

//   useEffect(() => {
//     fetch("http://localhost:5273/api/Movie", {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         "Authorization": `Bearer ${token}` // 🔥 Додаємо JWT токен

//       },
//       credentials: 'include'  // Якщо використовуєте куки для автентифікації
//     })
//     .then(response => {
//       if (!response.ok) {
//           throw new Error("Помилка авторизації");
//       }
//       return response.json();
//   })
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setMovies(data);
//         } else {
//           console.error("Некоректні дані: очікується масив фільмів");
//         }
//       })
//       .catch((error) => console.error("Помилка завантаження фільмів:", error));

//       const token = localStorage.getItem("token"); // Отримуємо токен з localStorage

//       fetch("http://localhost:5273/api/Sessions", {
//           method: "GET",
//           headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}` // 🔥 Додаємо JWT токен
//           },
//           credentials: "include" // Дозволяє надсилати куки (необов'язково для JWT)
//       })
//       .then(response => {
//           if (!response.ok) {
//               throw new Error(`Помилка завантаження сеансів: ${response.statusText}`);
//           }
//           return response.json();
//       })
//       .then(data => setSessions(data))
//       .catch(error => console.error("Помилка завантаження сеансів:", error));
      
//       fetch("http://localhost:5273/api/Halls", {
//           method: "GET",
//           headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`
//           },
//           credentials: "include"
//       })
//       .then(response => {
//           if (!response.ok) {
//               throw new Error(`Помилка завантаження залів: ${response.statusText}`);
//           }
//           return response.json();
//       })
//       .then(data => setHalls(data))
//       .catch(error => console.error("Помилка завантаження залів:", error));
      
//     }, []);
  
  
//   const handleInputChange = (e, isEditing = false, isSession = false) => {
//     const { name, value } = e.target;
//     const newValue = name === "movieId" || name === "hallId" ? Number(value) : value; 

//     if (isSession) {
//       if (editingSession) {
//         setEditingSession((prev) => ({ ...prev, [name]: newValue }));
//       } else {
//         setNewSession((prev) => ({ ...prev, [name]: newValue }));
//       }
//     } else {
//       if (isEditing) {
//         setEditingMovie((prev) => ({ ...prev, [name]: value }));
//       } else {
//         setNewMovie((prev) => ({ ...prev, [name]: value }));
//       }
//     }


//   };
//   const handleAddMovie = () => {
//     setShowMovieForm(true);
//     setEditingMovie(null);
//     setNewMovie({
//       filmName: "",
//       rating: "",
//       actors: "",
//       trailer: "",
//       genres: "",
//       director: "",
//       description: "",
//       duration: "",
//       ageRating: "",
//       releaseDate: "",
//       posterPath: "",
//       backgroundImagePath: "",
//       voteAverage: "",
//       voteCount: "",
//       sessions: []
//     });
//   };
  
//   async function fetchOrCreateGenre(name) {
//     try {
//         const response = await fetch("http://localhost:5273/api/Genres");
//         const genres = await response.json();

//         let genre = genres.find(g => g.name.toLowerCase() === name.toLowerCase());
//         if (genre) return genre.id; // Жанр знайдено

//         // Якщо жанру немає, додаємо його
//         const createResponse = await fetch("http://localhost:5273/api/Genres", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name })
//         });

//         if (!createResponse.ok) throw new Error("Не вдалося створити жанр");
//         const newGenre = await createResponse.json();
//         return newGenre.id;
//     } catch (error) {
//         console.error("Помилка при роботі з жанрами:", error);
//         return null;
//     }
// }
// async function fetchOrCreateActor(name) {
//   try {
//       const response = await fetch("http://localhost:5273/api/Actors");
//       const actors = await response.json();

//       let actor = actors.find(a => a.name.toLowerCase() === name.toLowerCase());
//       if (actor) return actor.id; // Актор знайдений

//       // Якщо актора немає, додаємо його
//       const createResponse = await fetch("http://localhost:5273/api/Actors", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name })
//       });

//       if (!createResponse.ok) throw new Error("Не вдалося створити актора");
//       const newActor = await createResponse.json();
//       return newActor.id;
//   } catch (error) {
//       console.error("Помилка при роботі з акторами:", error);
//       return null;
//   }
// }
// async function fetchOrCreateDirector(name) {
//   try {
//       const response = await fetch("http://localhost:5273/api/Directors");
//       const directors = await response.json();

//       let director = directors.find(d => d.name.toLowerCase() === name.toLowerCase());
//       if (director) return director.id; // Якщо режисер знайдений, повертаємо його ID

//       // Якщо режисера немає, створюємо нового
//       const createResponse = await fetch("http://localhost:5273/api/Directors", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name })
//       });

//       if (!createResponse.ok) throw new Error("Не вдалося створити режисера");
//       const newDirector = await createResponse.json();
//       return newDirector.id;
//   } catch (error) {
//       console.error("Помилка при роботі з режисерами:", error);
//       return null;
//   }
// }

// const handleSaveNewMovie = async () => {
//   try {
//     const genreNames = newMovie.genres.split(',').map(g => g.trim());
//     const actorNames = newMovie.actors.split(',').map(a => a.trim());
//     const directorName = newMovie.director.trim();

//     // Отримуємо ID для жанрів, акторів та режисера
//     const genreIds = await Promise.all(genreNames.map(name => fetchOrCreateGenre(name)));
//     const actorIds = await Promise.all(actorNames.map(name => fetchOrCreateActor(name)));
//     const directorId = await fetchOrCreateDirector(directorName);

//     // Формуємо об'єкт фільму для запиту
//     const formattedMovie = {
//       filmName: newMovie.filmName,
//       rating: newMovie.rating,
//       description: newMovie.description,
//       trailer: newMovie.trailer,
//       duration: parseInt(newMovie.duration) || 0,
//       ageRating: parseInt(newMovie.ageRating) || 0,
//       posterPath: newMovie.posterPath,
//       backgroundImagePath: newMovie.backgroundImagePath,
//       voteAverage: parseFloat(newMovie.voteAverage) || 0,
//       voteCount: parseInt(newMovie.voteCount) || 0,
//       genres: genreIds,
//       actors: actorIds,
//       directorId: directorId,
//       sessions: newMovie.sessions
//     };

//     if (newMovie.releaseDate && newMovie.releaseDate.trim() !== "") {
//       formattedMovie.releaseDate = new Date(newMovie.releaseDate).toISOString();
//     }

//     let response;
//     if (editingMovie) {
//       // **ОНОВЛЕННЯ ФІЛЬМУ**
//       response = await fetch(`http://localhost:5273/api/Movie/${editingMovie.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedMovie)
//       });
//     } else {
//       // **ДОДАВАННЯ НОВОГО ФІЛЬМУ**
//       response = await fetch("http://localhost:5273/api/Movie", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedMovie)
//       });
//     }

//     if (!response.ok) throw new Error(await response.text());
//     const data = await response.json();

//     // Оновлюємо стан фільмів у списку
//     setMovies(prevMovies => editingMovie
//       ? prevMovies.map(m => (m.id === editingMovie.id ? data : m))
//       : [...prevMovies, data]
//     );

//     // Очищуємо форму
//     setNewMovie({
//       filmName: "",
//       rating: "",
//       actors: "",
//       genres: "",
//       trailer: "",
//       director: "",
//       description: "",
//       duration: "",
//       ageRating: "",
//       releaseDate: "",
//       posterPath: "",
//       backgroundImagePath: "",
//       voteAverage: "",
//       voteCount: "",
//       sessions: []
//     });
//     setEditingMovie(null);
//     setShowMovieForm(false);

//   } catch (error) {
//     console.error("Помилка збереження фільму:", error);
//   }
// };


//   const handleEditMovie = (movie) => {
//     setEditingMovie(movie);
//     setShowMovieForm(true);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const response = await fetch(`http://localhost:5273/api/Movie/${editingMovie.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editingMovie),
//       });
//       if (!response.ok) throw new Error("Не вдалося оновити фільм");
//       const updatedMovie = await response.json();
//       setMovies(movies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie)));
//       setEditingMovie(null);
//       setShowMovieForm(false);
//     } catch (error) {
//       console.error("Помилка збереження фільму:", error);
//     }
//   };
//   const handleDeleteMovie = (id) => {
//     if (window.confirm("Ви впевнені, що хочете видалити цей фільм?")) {
//       fetch(`http://localhost:5273/api/Movie/${id}`, {
//         method: "DELETE",
//       })
//         .then((response) => {
//           if (response.ok) {
//             setMovies(movies.filter((movie) => movie.id !== id));
//           } else {
//             console.error("Не вдалося видалити фільм. Статус: ", response.status);
//           }
//         })
//         .catch((error) => console.error("Помилка при видаленні фільму:", error));
//     }
//   };async function fetchOrCreateHall(name) {
//     try {
//         // Отримуємо список всіх залів
//         const response = await fetch("http://localhost:5273/api/Halls");
//         const halls = await response.json();
  
//         // Шукаємо зал за назвою (регістр не враховується)
//         let hall = halls.find(h => h.name.toLowerCase() === name.toLowerCase());
//         if (hall) return hall.id; // Якщо зал знайдений, повертаємо його ID
  
//         // Якщо зал не знайдений, створюємо новий
//         const createResponse = await fetch("http://localhost:5273/api/Halls", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name })
//         });
  
//         if (!createResponse.ok) throw new Error("Не вдалося створити зал");
//         const newHall = await createResponse.json();
//         return newHall.id;
//     } catch (error) {
//         console.error("Помилка при роботі з залами:", error);
//         return null;
//     }
//   }
//   const handleAddSession = async () => {
//     try {
//       console.log("Нова сесія:", newSession);
  
//       if (!newSession.hallId) {
//         console.error("Не вказано залу");
//         return;
//       }
  
//       const newSessionData = {
//         movieId: newSession.movieId,
//         price: parseFloat(newSession.price),
//         hallId: newSession.hallId,  // Тепер використовуємо hallId замість hallName
//       };
  
//       if (newSession.startTime && newSession.startTime.trim() !== "") {
//         newSessionData.startTime = new Date(newSession.startTime).toISOString();
//       }
//       if (newSession.endTime && newSession.endTime.trim() !== "") {
//         newSessionData.endTime = new Date(newSession.endTime).toISOString();
//       }
  
//       console.log("Дані для відправки:", newSessionData);
  
//       const response = await fetch("http://localhost:5273/api/Sessions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newSessionData),
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Помилка при створенні сеансу:", errorText);
//         throw new Error("Не вдалося створити сеанс");
//       }
  
//       // Після створення одразу отримуємо всі актуальні сеанси
//       const updatedSessionsResponse = await fetch("http://localhost:5273/api/Sessions");
//       const updatedSessions = await updatedSessionsResponse.json();
  
//       console.log("Оновлені сеанси:", updatedSessions);
  
//       setSessions(updatedSessions); // Оновлюємо список сеансів правильно
  
//       setNewSession({ movieId: "", startTime: "", endTime: "", price: "", hallId: "" }); // Очищуємо форму
  
//     } catch (error) {
//       console.error("Помилка при додаванні сеансу:", error);
//     }
//   };
//   const fromUTCtoLocal = (utcString) => {
//     if (!utcString) return "";
//     const date = new Date(utcString);
//     return date.toISOString().slice(0, 16); // `YYYY-MM-DDTHH:MM`
//   };
  
//   const handleEditSession = (session) => {
//     const movie = movies.find((m) => m.id === session.movieId);
//     const hall = halls.find((h) => h.id === session.hallId);
  
//     setEditingSession({
//       ...session,
//       movieId: session.movieId || "",
//       hallId: session.hallId || "",
//       movieName: movie ? movie.filmName : "",
//       hallName: hall ? hall.name : "",
//       startTime: fromUTCtoLocal(session.startTime),
//       endTime: fromUTCtoLocal(session.endTime),
//     });
//   };
//   const toUTC = (localDateTime) => {
//     if (!localDateTime) return null;
//     const date = new Date(localDateTime);
//     return date.toISOString(); // Генерує формат `YYYY-MM-DDTHH:MM:SS.SSSZ`
//   };
//   const handleSaveSessionEdit = async () => {
//     try {
//       const updatedSession = {
//         ...editingSession,
//         startTime: toUTC(editingSession.startTime),
//         endTime: toUTC(editingSession.endTime),
//       };
  
//       console.log('Оновлені дані для збереження:', updatedSession);
  
//       const response = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedSession),
//       });
  
//       console.log('Статус відповіді:', response.status);
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Помилка від сервера:', errorText);
//         throw new Error(`Не вдалося оновити сеанс: ${errorText}`);
//       }
  
//       // Після успішного збереження, запитуємо оновлені дані для цього сеансу
//       const updatedSessionResponse = await fetch(`http://localhost:5273/api/Sessions/${editingSession.id}`);
//       if (updatedSessionResponse.ok) {
//         const savedSession = await updatedSessionResponse.json();
//         setSessions((prevSessions) =>
//           prevSessions.map((session) =>
//             session.id === savedSession.id ? savedSession : session
//           )
//         );
//       } else {
//         console.error('Не вдалося отримати оновлений сеанс');
//       }
  
//       setEditingSession(null); // Очистити форму редагування
//     } catch (error) {
//       console.error("Помилка при редагуванні сеансу:", error);
//     }
//   };
  
  
//   const handleDeleteSession = (sessionId) => {
//     if (window.confirm("Ви впевнені, що хочете видалити цей сеанс?")) {

//     fetch(`http://localhost:5273/api/Sessions/${sessionId}`, {
//       method: "DELETE",
//     })
//       .then(() => {
//         setSessions(sessions.filter(session => session.id !== sessionId));
//       })
//       .catch((error) => console.error("Помилка при видаленні сеансу:", error));
//       };}
  
//   return (
//     <div className="admin-panel">
//       <h1 className="admin-panel__title">Адмін-панель</h1>
      
//       <button className="admin-panel__button-add" onClick={handleAddMovie}>
//         Додати новий фільм
//       </button>
      
//       <button className="admin-panel__button-add" onClick={() => setShowSessions(!showSessions)}>
//         {showSessions ? "Сховати сеанси" : "Показати сеанси"}
//       </button>
  
//       {showSessions && (
//         <div className="admin-panel__sessions">
//           <h3>Список сеансів</h3>
// <div className="admin-panel__sessions-list">
//   {[...sessions]
//     .map((session) => {
//       const movie = movies.find((m) => m.id === session.movieId);
//       const hall = halls.find((h) => h.id === session.hallId);
//       return {
//         ...session,
//         movieName: movie ? movie.filmName : "Невідомо",
//         hallName: hall ? hall.name : "Невідомо",
//       };
//     })
//     .sort((a, b) => a.movieName.localeCompare(b.movieName)) // Сортування за назвою фільму
//     .map((session) => (
//       <div key={session.id} className="session-item">
//         <span><strong>Фільм:</strong> {session.movieName}</span>
//         <span><strong>Час:</strong> {session.startTime} - {session.endTime}</span>
//         <span><strong>Ціна:</strong> {session.price} грн</span>
//         <span><strong>Зала:</strong> {session.hallName}</span>
//         <button 
//             className="admin-panel__button-edit"
//             onClick={() => handleEditSession(session)}
//           >
//             Редагувати
//           </button>

//           <button 
// className="admin-panel__button-delete"
//             onClick={() => handleDeleteSession(session.id)}
//           >
//             Видалити
//             </button>

//       </div>
//     ))}
// </div>
// <div className="admin-panel__movie-form">
//           {editingSession ? (
//             <div className="admin-panel__sessions-form">
//               <h3>Редагувати сеанс</h3>

//               <select
//                 name="movieId"
//                 value={editingSession.movieId}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               >
//                 <option value="">Оберіть фільм</option>
//                 {movies.map((movie) => (
//                   <option key={movie.id} value={movie.id}>
//                     {movie.filmName}
//                   </option>
//                 ))}
//               </select>

//               <select
//   name="hallId"
//   value={editingSession.hallId }
//   onChange={(e) => handleInputChange(e, true, true)}
// >
//   <option value="">Оберіть залу</option>
//   {halls.map((hall) => (
//     <option key={hall.id} value={hall.id}>
//       {hall.name}
//     </option>
//   ))}
// </select>

//               <input
//                 type="datetime-local"
//                 name="startTime"
//                 value={editingSession.startTime || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <input
//                 type="datetime-local"
//                 name="endTime"
//                 value={editingSession.endTime || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <input
//                 type="number"
//                 name="price"
//                 value={editingSession.price || ""}
//                 onChange={(e) => handleInputChange(e, true, true)}
//               />

//               <button className="admin-panel__button-save"  onClick={handleSaveSessionEdit}>Зберегти зміни</button>
//             </div>
//           ) : (
//             <div className="admin-panel__sessions-form">
//               <h3>Додати новий сеанс</h3>

//               <select
//                 name="movieId"
//                 value={newSession.movieId}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               >
//                 <option value="">Оберіть фільм</option>
//                 {movies.map((movie) => (
//                   <option key={movie.id} value={movie.id}>
//                     {movie.filmName}
//                   </option>
//                 ))}
//               </select>
//               <select
//   name="hallId"
//   value={newSession.hallId }
//   onChange={(e) => handleInputChange(e, true, true)}
// >
//   <option value="">Оберіть залу</option>
//   {halls.map((hall) => (
//     <option key={hall.id} value={hall.id}>
//       {hall.name}
//     </option>
//   ))}
// </select>
              

//               <input
//                 type="datetime-local"
//                 name="startTime"
//                 value={newSession.startTime || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <input
//                 type="datetime-local"
//                 name="endTime"
//                 value={newSession.endTime || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Ціна"
//                 value={newSession.price || ""}
//                 onChange={(e) => handleInputChange(e, false, true)}
//               />

//               <button className="admin-panel__button-add" onClick={handleAddSession}>
//                 Додати сеанс
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
    
//       )}
  
//       <div className="admin-panel__movie-list">
//         {movies.map((movie) => (
//           <div key={movie.id} className="admin-panel__movie-item">
//             {movie.posterPath && (
//               <img src={movie.posterPath} alt={movie.filmName} className="admin-panel__movie-poster" />
//             )}
//             <span>{movie.filmName}</span>
//             <button className="admin-panel__button-edit" onClick={() => handleEditMovie(movie)}>
//               Редагувати
//             </button>
//             <button className="admin-panel__button-delete" onClick={() => handleDeleteMovie(movie.id)}>
//               Видалити
//             </button>
//           </div>
//         ))}
//       </div>
  
//       {showMovieForm && (
//         <div className="admin-panel__movie-form">
//           <h3>{editingMovie ? "Редагувати фільм" : "Додати новий фільм"}</h3>
  
//           <input type="text" name="filmName" placeholder="Назва" value={newMovie.filmName} onChange={handleInputChange} />
//           <input type="text" name="description" placeholder="Опис" value={newMovie.description} onChange={handleInputChange} />
//           <input type="text" name="trailer" placeholder="Трейлер" value={newMovie.trailer} onChange={handleInputChange} />
//           <input type="number" name="duration" placeholder="Тривалість" value={newMovie.duration} onChange={handleInputChange} />
//           <input type="number" name="ageRating" placeholder="Віковий рейтинг" value={newMovie.ageRating} onChange={handleInputChange} />
  
//           <input 
//             type="date" 
//             name="releaseDate" 
//             value={newMovie.releaseDate ? new Date(newMovie.releaseDate).toISOString().split('T')[0] : ''} 
//             onChange={handleInputChange} 
//           />
  
//           <input type="text" name="posterPath" placeholder="Постер" value={newMovie.posterPath} onChange={handleInputChange} />
//           <input type="text" name="backgroundImagePath" placeholder="Фон" value={newMovie.backgroundImagePath} onChange={handleInputChange} />
//           <input type="number" name="voteAverage" placeholder="Рейтинг" value={newMovie.voteAverage} onChange={handleInputChange} />
//           <input type="number" name="voteCount" placeholder="Кількість голосів" value={newMovie.voteCount} onChange={handleInputChange} />
//           <input type="text" name="genres" placeholder="Жанри (через кому)" value={newMovie.genres} onChange={handleInputChange} />
//           <input type="text" name="actors" placeholder="Актори (через кому)" value={newMovie.actors} onChange={handleInputChange} />
//           <input type="text" name="director" placeholder="Режисер" value={newMovie.director} onChange={handleInputChange} />
  
//           <button className="admin-panel__button-save" onClick={editingMovie ? handleSaveEdit : handleSaveNewMovie}>
//             {editingMovie ? "Зберегти зміни" : "Додати фільм"}
//           </button>
  
//           <button className="admin-panel__button-cancel" onClick={() => { setShowMovieForm(false); setEditingMovie(null); }}>
//             Скасувати
//           </button>
//         </div>
//       )}
//     </div>
//   );
  
// };

// export default AdminPage;