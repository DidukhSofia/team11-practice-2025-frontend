import React, { Component } from 'react';
import './Seat.css';
import { BsCalendar2Date } from "react-icons/bs";
import { CiAlarmOn } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import Line from "../../images/line.svg"; // додайте шлях до лінії

class Seat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieData: null,
      selectedSeats: JSON.parse(localStorage.getItem('selectedSeats')) || [],
      purchasedSeats: JSON.parse(localStorage.getItem('purchasedSeats')) || [],
    };

    // Bind methods to ensure the correct context
    this.selectSeat = this.selectSeat.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.resetSelection = this.resetSelection.bind(this);
    this.clearAllSeats = this.clearAllSeats.bind(this);
    this.removeTicket= this.removeTicket.bind(this);
  }

  componentDidMount() {
    const { sessionId, hallId } = this.props;

    fetch('/Get_All.json')
      .then(response => response.json())
      .then(data => {
        const session = data.sessions.find(s => s.id === parseInt(sessionId));
        const movie = data.movies.find(m => m.id === session.movieId);
        const hall = data.halls.find(h => h.id === parseInt(hallId));
        const seats = data.seats.filter(s => s.hallId === hall.id);
        const bookedSeats = data.bookings.filter(b => b.sessionId === session.id).map(b => b.seatId);

        this.setState({
          movieData: { movie, session, hall, seats },
          purchasedSeats: [...new Set([...this.state.purchasedSeats, ...bookedSeats])],
        });
      })
      .catch(error => console.error('Error loading the movie data:', error));
  }

  // Format time as "HH:MM"
  formatTime(time) {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Format date as "DD.MM.YYYY Day"
  formatDate(startTime) {
    const date = new Date(startTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${day}.${month}.${year} ${dayOfWeek}`;
  }

  // Select a seat
  selectSeat(seatId) {
    const { selectedSeats, purchasedSeats } = this.state;

    if (purchasedSeats.includes(seatId)) return;

    const updatedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(id => id !== seatId)
      : [...selectedSeats, seatId];

    this.setState({ selectedSeats: updatedSeats }, () => {
      localStorage.setItem('selectedSeats', JSON.stringify(updatedSeats));
    });
  }

  // Handle payment action
  handlePayment() {
    const { selectedSeats, purchasedSeats } = this.state;
    if (selectedSeats.length === 0) return;

    const newPurchasedSeats = [...new Set([...purchasedSeats, ...selectedSeats])];
    
    this.setState({
      purchasedSeats: newPurchasedSeats,
      selectedSeats: [],
    }, () => {
      localStorage.setItem('purchasedSeats', JSON.stringify(newPurchasedSeats));
      localStorage.removeItem('selectedSeats');
    });
  }

  // Reset seat selection
  resetSelection() {
    this.setState({ selectedSeats: [] }, () => {
      localStorage.removeItem('selectedSeats');
    });
  }

  // Clear all purchased seats
  clearAllSeats() {
    this.setState({ purchasedSeats: [] }, () => {
      localStorage.removeItem('purchasedSeats');
    });
  }

  removeTicket(seatId) {
    const {purchasedSeats} = this.state;
    const updatedPurchasedSeats = purchasedSeats.filter(id => id !== seatId);
    this.setState({ purchasedSeats: updatedPurchasedSeats }, () => {
      localStorage.setItem('purchasedSeats', JSON.stringify(updatedPurchasedSeats));
    });
  }

  render() {
    const { movieData, selectedSeats, purchasedSeats } = this.state;
    if (!movieData) return <div>Loading...</div>;

    const { movie, session, hall, seats } = movieData;
    const seatGrid = Array.from({ length: hall.rows }, () => Array(hall.columns).fill(null));

    seats.forEach(seat => {
      const isSelected = selectedSeats.includes(seat.id);
      const isPurchased = purchasedSeats.includes(seat.id);
      seatGrid[seat.row - 1][seat.column - 1] = (
        <div
          className={`Seat ${isSelected ? "selected" : ""} ${isPurchased ? "purchased" : "available"}`}
          key={seat.id}
          onClick={!isPurchased ? () => this.selectSeat(seat.id) : undefined}
          style={{ cursor: isPurchased ? 'not-allowed' : 'pointer', backgroundColor: isPurchased ? '#ccc' : '' }}
        >
          {seat.row}-{seat.column}
        </div>
      );
    });

    

    const purchasedSeatsDetails = purchasedSeats.map(seatId => {
      const seat = seats.find(s => s.id === seatId);
      return seat ? (
        <div key={seat.id} className="purchased-seat-detail">
          <p>{seat.row} ряд {seat.column} місце SUPER LUX {session.price} грн</p>
          <button className="remove-ticket-btn" onClick={() => this.removeTicket(seatId)}>×</button>
        </div>
      ) : null;
    });

    return (
        <section className="widget">
          <div>
            <div className="widget-container">
              <img src={movie.posterPath} alt={movie.filmName} className="widget-poster" />
              <div className="widget-container-text">
                <h1 className="widget__name">{movie.filmName}</h1>
                <div className="widget__format">
                  <p className="format">2D</p>
                  <p className="format">SDH</p>
                </div>
                <div className="widget-container__time">
                  <CiAlarmOn style={{ color: "grey", fontSize: "20px" }} />
                  <p className="widget__time">
                    <strong>Час {this.formatTime(session.startTime)} <strong>-</strong> {this.formatTime(session.endTime)}</strong>
                  </p>
                </div>
                <div className="widget__date">
                  <BsCalendar2Date style={{ color: "grey", fontSize: "20px" }} />
                  <p className="widget__current-date"><strong>{this.formatDate(session.startTime)}</strong></p>
                </div>
                <div className="widget-container__location">
                  <CiLocationOn style={{ color: "grey", fontSize: "20px" }} />
                  <p className="widget__location"><strong>Lux Cimena Theatre</strong></p>
                </div>
              </div>
            </div>

              <div className="widget__seatplan">
              <div className="widget__seat-reserved">
                  <div className="widget-container__price">
                  <p className="widget__red-block"></p>
                  <p className="widget__price">Super Lux - {session.price} грн</p>
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
                      <div className="Row" key={rowIndex}>{row}</div>
                      ))}
                  </div>

              </div>
            </div>
            <div className='widget__cart'>
              <div className='widget__cart-btn' style={{ textAlign: 'center', backgroundColor: 'white' }}>
                <button
                  className="widget__button"
                  onClick={() => this.handlePayment()}
                  disabled={selectedSeats.length === 0}
                >
                {selectedSeats.length === 0 ? 'Select seats' : 'Pay'}
                </button>
                  <button
                    className="widget__button"
                    onClick={this.clearAllSeats}
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                  >
                  Clear All Seats
                </button>
              </div>
              <div className="widget__cart-info">
                <p>Куплено білетів: {purchasedSeats.length}</p>
                {purchasedSeatsDetails}
              </div>
            </div>
        </section>
    );
  }
}

export default Seat;