import React, { useState } from "react";
import "./Sessions.css";
import User from "../../images/user-profil-image.png";
import Filter from "../../components/Filter/Filter";

function Head(){
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Стан для відкриття/закриття списку

  // Функція для зміни вибраної опції
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

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
            src={User}
            alt="User Profile"
            className="user__profil-image"
          />
        </div>
      </div>
    </div>
  );
}

const Sessions = () => {
  return (
    <section className="sessions">
      <Head/>
      <Filter />
    </section>
  );
};
export default Sessions;
