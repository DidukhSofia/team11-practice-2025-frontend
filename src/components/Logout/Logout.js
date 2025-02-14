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

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Додаємо стан для перевірки автентифікації

  // Перевіряємо, чи є токен у localStorage при завантаженні компонента
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Якщо токен є, то користувач авторизований
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
  
    try {
      const response = await fetch(`http://localhost:5273${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        if (isLoginMode) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role); // Зберігаємо роль
          setIsAuthenticated(true);
          alert("Вхід успішний!");
  
          if (data.role === "admin") {
            window.location.href = "/admin"; // Якщо адмін, йде в адмінку
          } else {
            window.location.href = "/"; // Якщо юзер, йде на головну
          }
        } else {
          alert("Реєстрація успішна! Увійдіть у систему.");
          setIsLoginMode(true);
        }
        setIsModalVisible(false);
      } else {
        alert(data.message || "Помилка авторизації");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // Видаляємо токен з localStorage
    setIsAuthenticated(false); // Оновлюємо стан
    alert("Ви вийшли з системи!");
    window.location.href = "/"; // Перенаправляємо на головну сторінку
  };

  return (
    <div className="auth-container">
      {!isAuthenticated ? (
        <button
          onClick={() => setIsModalVisible(true)}
          className="auth-window__form"        >
          Увійти / Реєстрація
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="auth-window__form"        >
          Вийти
        </button>
      )}

      {isModalVisible && (
        <div className="auth-window">
          <div className="auth-window__form">
            <button
              onClick={() => setIsModalVisible(false)}
              className="auth-window__form-close"
            >
              X
            </button>

            <h2 className="auth-window__title">
              {isLoginMode ? "Увійти" : "Реєстрація"}
            </h2>

            <form onSubmit={handleFormSubmit} className="auth-form">
              {!isLoginMode && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Повне ім'я"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="Логін"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input"
                required
              />

              <button type="submit" className="auth-submit-button">
                {isLoginMode ? "Увійти" : "Реєстрація"}
              </button>
            </form>

            <p className="auth-switch">
              {isLoginMode ? "Немає облікового запису?" : "Вже маєте акаунт?"}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="auth-switch-button"
              >
                {isLoginMode ? "Реєстрація" : "Увійти"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
