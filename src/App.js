import MovieDetails from "./pages/MovieDetails/MovieDetails";
import MoviesPage from "./pages/MoviesPage/MoviesPage";


import "./App.css";
import Aside from "./components/Aside/Aside";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <Router>
        <Aside />

          <Routes>
          <Route path="/movies" element={<MoviesPage />} />

            <Route path="/movies/:movieId" element={<MovieDetails />} />
          </Routes>
    </Router>
  );
};

export default App;
