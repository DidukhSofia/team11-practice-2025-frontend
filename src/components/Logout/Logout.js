import React, { useState, useEffect } from "react";
import "./Logout.css";

export default function Logout() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rol: ""
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
    const apiUrl = `https://localhost:7230${endpoint}`;

    try {
      console.log("Sending request to:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response received:", response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (isLoginMode) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setIsAuthenticated(true);
        alert("Вхід успішний!");
        window.location.href = data.role === "admin" ? "/admin" : "/";
      } else {
        alert("Реєстрація успішна! Увійдіть у систему.");
        setIsLoginMode(true);
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Помилка авторизації. Перевірте підключення до сервера.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("Ви вийшли з системи!");
    window.location.href = "/";
  };

  return (
    <div className="auth-container">
      {!isAuthenticated ? (
        <button onClick={() => setIsModalVisible(true)} className="auth-window__form-btn">
          Увійти
        </button>
      ) : (
        <button onClick={handleLogout} className="auth-window__form-btn">
          Вийти
        </button>
      )}

      {isModalVisible && (
        <div className="auth-window">
          <div className="auth-window__form">
            <button onClick={() => setIsModalVisible(false)} className="auth-window__form-close">
              X
            </button>
            <h2 className="auth-window__title">{isLoginMode ? "Увійти" : "Реєстрація"}</h2>
            <form onSubmit={handleFormSubmit} className="auth-form">
              {!isLoginMode && (
                <>
                  <input type="text" name="fullName" placeholder="Повне ім'я" value={formData.fullName || ''} onChange={handleInputChange} className="auth-input" required />
                  <input type="text" name="username" placeholder="Логін" value={formData.username} onChange={handleInputChange} className="auth-input" required />
                </>
              )}
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="auth-input" required />
              <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleInputChange} className="auth-input" required />
              <button type="submit" className="auth-submit-button">{isLoginMode ? "Увійти" : "Реєстрація"}</button>
            </form>
            <p className="auth-switch">
              {isLoginMode ? "Немає облікового запису?" : "Вже маєте акаунт?"}
              <button onClick={() => setIsLoginMode(!isLoginMode)} className="auth-switch-button">
                {isLoginMode ? "Реєстрація" : "Увійти"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
