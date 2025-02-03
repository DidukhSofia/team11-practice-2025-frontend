import React, { useState, useEffect } from "react";
import "./Sessions.css";
import Filter from "../../components/Filter/Filter";
import user from "../../images/user-profil-image.png";

const Sessions = () => {
  return (
    <section className="sessions">
      <Head />
      <Filter />
    </section>
  );
};
export default Sessions;

function Head(){
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Стан для відкриття/закриття списку

  // Функція для зміни вибраної опції
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Функція для перемикання стану випадаючого списку
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`head ${isDropdownOpen ? "head--expanded" : ""}`}> {/* Додаємо клас для зміщення */}
      <div className="head__logo">
        <h1 className="head-title">СЕАНСИ</h1>
      </div>
      <div className="head__authentication">
        <div className="head__dropdown">
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="authentication__select"
            onClick={toggleDropdown} // Перемикаємо стан при натисканні на select
          >
            <option className="authentication__name" value="name">Anastasia</option>
            <option value="profile">Profile</option>
            <option value="settings">Settings</option>
            <option value="logout">Logout</option>
          </select>
        </div>

        <div className="authentication__user">
          <img
            src={user}
            alt="User Profile"
            className="user__profil-image"
          />
        </div>
      </div>
    </div>
  );
}
