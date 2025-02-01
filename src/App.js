import "./App.css";
import Aside from "./components/Aside/Aside";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <Router>
        <Aside />
          <Routes>
          </Routes>
    </Router>
  );
};

export default App;
