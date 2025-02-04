import MovieDetails from "./pages/MovieDetails/MovieDetails";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import AdminPage from "./pages/AdminPage/AdminPage";


import "./App.css";
import Aside from "./components/Aside/Aside";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Sessions from "./pages/Sessions/Sessions";
import Main from "./pages/Main/Main";

const App = () => {
  return (
    <Router>
        <Aside />

          <Routes>
          <Route path="/movies" element={<MoviesPage />} />
            <Route path="/" element={<Main />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
          </Routes>
    </Router>
  );
};

export default App;
