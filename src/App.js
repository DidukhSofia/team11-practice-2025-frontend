import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails/MovieDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/movies/:movieId" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
