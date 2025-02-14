// // src/auth/auth.js
// export const register = async (fullName, username, email, password) => {
//     try {
//         const response = await fetch("http://localhost:5273/api/Auth/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ fullName, username, email, password }),
//         });

//         if (!response.ok) {
//             throw new Error("Помилка реєстрації");
//         }

//         const data = await response.json();
//         return data; // Повертаємо дані (можливо, повідомлення про успіх)
//     } catch (error) {
//         console.error("Помилка реєстрації:", error);
//         throw error;
//     }
// };
