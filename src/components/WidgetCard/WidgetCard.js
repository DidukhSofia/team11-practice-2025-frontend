// import React, { useState, useEffect } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import "./WidgetCard.css";
// import { BsCalendar2Date } from "react-icons/bs";
// import { CiAlarmOn } from "react-icons/ci";
// import { CiLocationOn } from "react-icons/ci";
// import Line from "../../images/line.svg";

// function WidgetCard() {
//     const { movieId } = useParams();
//     const [searchParams] = useSearchParams();
//     const sessionId = searchParams.get("sessionId");

//     const [movie, setMovie] = useState(null);
//     const [session, setSession] = useState(null);

//     useEffect(() => {
//         fetch("/Get_All.json")
//             .then((response) => response.json())
//             .then((data) => {
//                 const foundMovie = data.movies.find((m) => m.id.toString() === movieId);
//                 if (foundMovie) {
//                     setMovie(foundMovie);
//                     const foundSession = foundMovie.sessions.find(s => s.id.toString() === sessionId);
//                     setSession(foundSession);
//                 }
//             })
//             .catch((error) => console.error("Error fetching movie data:", error));
//     }, [movieId, sessionId]);

//     if (!movie || !session) return <div>Завантаження...</div>;

//     const formatTime = (time) => {
//         return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const formatDate = (startTime) => {
//         const date = new Date(startTime);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
//         const dayOfWeek = daysOfWeek[date.getDay()];

//         return `${day}.${month}.${year} ${dayOfWeek}`;
//     };

//     return (
//         <section className="widget">
//             <div className="widget-container">
//                 <img src={movie.posterPath} alt={movie.filmName} className="widget-poster" />
//                 <div className="widget-container-text">
//                     <h1 className="widget__name">{movie.filmName}</h1>
//                     <div className="widget__format">
//                         <p className="format">2D</p>
//                         <p className="format">SDH</p>
//                     </div>
//                     <div className="widget-container__time">
//                         <CiAlarmOn style={{ color: "grey" , fontSize: "20px" }} />
//                         <p className="widget__time"><strong>Час {formatTime(session.startTime)} <strong>-</strong> {formatTime(session.endTime)}</strong></p>
//                     </div>
//                     <div className="widget__date">
//                         <BsCalendar2Date style={{ color: "grey" ,fontSize: "20px" }} />
//                         <p className="widget__current-date"><strong>{formatDate(session.startTime)}</strong></p>
//                     </div>
//                     <div className="widget-container__location">
//                         <CiLocationOn  style={{ color: "grey" ,fontSize: "20px" }} />
//                         <p className="widget__location"><strong>Lux Cimena Theathe</strong></p>
//                     </div>
//                 </div>
//             </div>
//             <div className="widget__seatplan">
//                 <div className="widget-container__price">
//                     <p className="widget__red-block"></p>
//                     <p className="widget__price">Super Lux - {session.price} грн</p>
//                 </div>
//                 <img src={Line} alt="Seat Plan Divider" className="widget__seatplan-line" />
//                 <p className="widget__screen">Екран</p>
//             </div>
            
//         </section>
//     );
// }

// export default WidgetCard;
