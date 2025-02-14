import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Aside from "./components/Aside/Aside"; // Бокове меню
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import AdminPage from "./pages/AdminPage/AdminPage";
import Sessions from "./pages/Sessions/Sessions";
import Main from "./pages/Main/Main";
import Widget from "./pages/Widget/Widget"
import "./App.css"; // Стилі

const App = () => {
 

  return (
    <Router>
      <Aside /> 

      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/movies" element={<MoviesPage />} /> 
        <Route path="/movies/:movieId" element={<MovieDetails />} />
        
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/session/:sessionId/hall/:hallId" element={<Widget />} />
      </Routes>
    </Router>
  );
};

export default App;
