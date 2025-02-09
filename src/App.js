import MovieDetails from "./pages/MovieDetails/MovieDetails";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import Widget from "./pages/Widget/Widget"
import "./App.css";
import Aside from "./components/Aside/Aside";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
            <Route path="/session/:sessionId/hall/:hallId" element={<Widget />} />
          </Routes>
    </Router>
  );
};

export default App;
