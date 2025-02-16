import React, { Component } from 'react';
import { CiAlarmOn, CiLocationOn } from 'react-icons/ci';
import { BsCalendar2Date } from 'react-icons/bs';
import Line from "../../images/line.svg";
import "./Seat.css";

class Seat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: 'Loading...',
      posterPath: '/default-poster.jpg',
      sessionStartTime: null,
      sessionEndTime: null,
      sessionPrice: null,
      selectedSeats: [],
      reservedSeats: [],
      availableSeats: [],
      hall: { rows: 0, columns: 0, id: 0 },
      isPaid: false,
      ticketsSent: false, 
    };

    this.selectSeat = this.selectSeat.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.clearAllSeats = this.clearAllSeats.bind(this);
  }

  componentDidMount() {
    const { sessionId, hallId } = this.props;
  
    this.setState({ sessionId });
  
    fetch(`https://localhost:7230/api/Sessions/${sessionId}`)
      .then(response => response.json())
      .then(session => {
        if (!session || !session.movieId) {
          throw new Error('Invalid session data');
        }
  
        return fetch(`https://localhost:7230/api/Movie/${session.movieId}`)
          .then(response => response.json())
          .then(movie => {
            return fetch(`https://localhost:7230/api/Halls/${hallId}`)
              .then(response => response.json())
              .then(hall => {
                return fetch(`https://localhost:7230/api/Sessions/${sessionId}/seats`)
                  .then(response => response.json())
                  .then(seatData => {
                    this.setState({
                      movieName: movie.filmName || 'Film not found',
                      posterPath: movie.posterPath || '/default-poster.jpg',
                      sessionStartTime: session.startTime,
                      sessionEndTime: session.endTime,
                      sessionPrice: session.price,
                      hall: hall,
                      availableSeats: seatData.availableSeats,
                      reservedSeats: seatData.reservedSeats, 
                    });
                  });
              });
          });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({
          movieName: 'Data not available',
          posterPath: '/default-poster.jpg',
        });
      });
  }
  removeSeat(seatId) {
    this.setState((prevState) => ({
      selectedSeats: prevState.selectedSeats.filter((id) => id !== seatId),
    }));
  }

  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
    return new Date(date).toLocaleTimeString('en-GB', options);
  }

 
  handlePayment() {
    const { selectedSeats, sessionId } = this.state;
  
    if (selectedSeats.length === 0) {
      console.log("Місця не вибрані.");
      return;
    }
  
    const accessToken = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email'); // Отримати електронну пошту
  
    // Перевірка наявності токена
    if (!accessToken) {
      console.error('Токен доступу відсутній. Будь ласка, увійдіть знову.');
      alert('Ви не авторизовані. Будь ласка, увійдіть, щоб забронювати місця.');
      return;
    }
  
    // Массив промісів для всіх бронювань
    const bookingPromises = selectedSeats.map(seatId => {
      if (!sessionId || !seatId) {
        console.error("Некоректні дані для бронювання!", { sessionId, seatId });
        alert("Помилка: некоректні дані для бронювання.");
        return;
      }
  
      return fetch('https://localhost:7320/api/Bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          seatId: seatId,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Помилка HTTP! Статус: ${response.status}`);
        }
        return response.json();
      });
    });
  
    // Очікуємо всі запити до того, як оновимо стани
    Promise.all(bookingPromises)
      .then(results => {
        console.log("Бронювання створено:", results);
  
        // Сповіщення про успішне бронювання з електронною поштою
        alert(`Місця успішно заброньовані! Ваші квитки відправлені на вашу електронну пошту: ${userEmail}`);
  
        this.setState((prevState) => ({
          reservedSeats: [...prevState.reservedSeats, ...selectedSeats],
          availableSeats: prevState.availableSeats.filter(seat => !selectedSeats.includes(seat)),
          selectedSeats: [], // Очищення вибраних місць
          isPaid: true, // Оновлення статусу оплати
          ticketsSent: true, // Встановлюємо, що квитки відправлені
        }));
      })
      .catch(error => {
        console.error('Помилка при створенні бронювання:', error);
  
        // Додатково перевіряємо статус відповіді
        if (error.response && error.response.status === 401) {
          alert('Сесія закінчилася. Будь ласка, увійдіть знову.');
          localStorage.removeItem('accessToken'); // Очистити прострочений токен
          window.location.reload(); // Оновити сторінку, щоб користувач авторизувався
        } else {
          alert('Не вдалося створити бронювання. Будь ласка, спробуйте ще раз.');
        }
      });
  }


  selectSeat(seatId) {
    const { selectedSeats, reservedSeats, isPaid } = this.state;
  
    if (reservedSeats.includes(seatId)) return;
  
    const updatedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(id => id !== seatId) 
      : [...selectedSeats, seatId];
  
    if (isPaid) {
      this.setState({ selectedSeats: updatedSeats, isPaid: false, ticketsSent: false });
    } else {
      this.setState({ selectedSeats: updatedSeats });
    }
  }

  clearAllSeats() {
    this.setState({ selectedSeats: [] });
  }

  renderCart() {
    const { selectedSeats, sessionPrice, isPaid, hall } = this.state;
    const totalPrice = selectedSeats.length * sessionPrice;
  
    return (
      <div className='widget__cart'>
        <div className='widget__cart-content'>
          
          <div className='widget__cart-summary'>
            <strong><h3>Квитки</h3></strong>
            <div className='widget__cart-summary__price'>
              <p> {selectedSeats.length} квитка, </p>
              <p>{totalPrice} грн</p>
            </div>
          </div>
  
          {selectedSeats.map((seatId) => {
            const row = Math.floor((seatId - 1) / hall.columns) + 1;
            const seatNumber = ((seatId - 1) % hall.columns) + 1;
            return (
              <div key={seatId} className='widget__cart-ticket'>
                <div className='widget__cart-ticket__info'>
                  <p>{row} ряд</p>
                  <p>{seatNumber} місце <strong> Super Lux</strong></p>
                  <p>{sessionPrice} грн</p>
                </div>
                <button
                  className="widget__cart-remove-button"
                  onClick={() => this.removeSeat(seatId)} 
                >
                  × 
              </button>
              </div>
              

            );
          })}
        </div>
  
          <div className='widget__cart-total'>
            <div className='widget__cart-total__price'>
              <h3>Всього до сплати:</h3>
              <h5>{totalPrice} грн</h5>
            </div>

            <button
              className="widget__button"
              onClick={this.handlePayment}
              disabled={selectedSeats.length === 0 || isPaid}
            >
              {isPaid ? 'Продовжити' : 'Оплатити'}
            </button>
          </div>

      </div>
    );
  }

  render() {
    const { movieName, posterPath, sessionStartTime, sessionEndTime, selectedSeats, reservedSeats, availableSeats, hall, sessionPrice } = this.state;
  
    const startSeatId = hall.id === 1 ? 1 : 151;
    const seatGrid = Array.from({ length: hall.rows }, () => Array.from({ length: hall.columns }, () => null));
  
    for (let row = 0; row < hall.rows; row++) {
      for (let col = 0; col < hall.columns; col++) {
        const seatId = startSeatId + row * hall.columns + col;
        const isSelected = selectedSeats.includes(seatId);
        const isReserved = reservedSeats.includes(seatId);
        const isAvailable = availableSeats.includes(seatId);
  
        if (isAvailable || isReserved) {
          seatGrid[row][col] = (
            <div
              className={`Seat ${isSelected ? "selected" : ""} ${isReserved ? "reserved" : "available"}`}
              key={seatId}
              onClick={!isReserved ? () => this.selectSeat(seatId) : undefined}
              style={{ cursor: isReserved ? 'not-allowed' : 'pointer', backgroundColor: isReserved ? '#ccc' : '' }}
              title={isReserved ? "Це місце зайняте" : `Ряд: ${row + 1}, Місце: ${col + 1}, Ціна: ${sessionPrice} грн`} // Змінюємо текст для заброньованих місць
            >
            </div>
          );
        }
      }
    }
  
    return (
      <section className="widget">
        <div>
          <div className="widget-container">
            <img src={posterPath} alt={movieName} className="widget-poster" />
            <div className="widget-container-text">
              <h1 className="widget__name">{movieName}</h1>
              <div className="widget__format">
                <p className="format">2D</p>
                <p className="format">SDH</p>
              </div>
              <div className="widget-container__time">
                <CiAlarmOn style={{ color: "grey", fontSize: "20px" }} />
                <p className="widget__time">
                  <strong>Час {this.formatTime(sessionStartTime)} <strong>-</strong> {this.formatTime(sessionEndTime)}</strong>
                </p>
              </div>
              <div className="widget__date">
                <BsCalendar2Date style={{ color: "grey", fontSize: "20px" }} />
                <p className="widget__current-date"><strong>{this.formatDate(sessionStartTime)}</strong></p>
              </div>
              <div className="widget-container__location">
                <CiLocationOn style={{ color: "grey", fontSize: "20px" }} />
                <p className="widget__location"><strong>Lux Cinema Theatre</strong></p>
              </div>
            </div>
          </div>
  
          <div className="widget__seatplan">
            <div className="widget__seat-reserved">
              <div className="widget-container__price">
                <p className="widget__red-block"></p>
                <p className="widget__price">Super Lux - {this.state.sessionPrice} грн</p>
              </div>
              <div className="widget-reserved">
                <p className="widget__grey-block"></p>
                <p className="widget__text">Заброньовано</p>
              </div>
            </div>
            <img src={Line} alt="Seat Plan Divider" className="widget__seatplan-line" />
            <p className="widget__screen">Екран</p>
  
            <div>
              {seatGrid.map((row, rowIndex) => (
                <div className="Row" key={rowIndex}>
                  {row.map((seat, colIndex) => {
                    const seatId = rowIndex * hall.columns + colIndex + 1;
                    return (
                      <div key={seatId}>
                        {seat && React.cloneElement(seat)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {this.renderCart()}
      </section>
    );
  }
}

export default Seat;