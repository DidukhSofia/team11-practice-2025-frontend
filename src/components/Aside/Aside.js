import "./Aside.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClock,
  faHeart,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/aside-logo.png";

const Aside = () => {
  const location = useLocation();

  return (
    <div className="aside">
      <Link to="/" className="aside__logo">
        <img src={logo} />
      </Link>
      <ul className="aside__items">
        <li className="aside__item">
          <Link
            to="/"
            className={`aside__link ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="aside__link-icon" />
            <span className="aside__link-text">Головна</span>
          </Link>
        </li>
        <li className="aside__item">
          <Link
            to="/sessions"
            className={`aside__link ${
              location.pathname === "/sessions" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faClock} className="aside__link-icon" />
            <span className="aside__link-text">Cеанси</span>
          </Link>
        </li>
        <li className="aside__item">
          <Link
            to="/movies"
            className={`aside__link ${
              location.pathname === "/movies" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faHeart} className="aside__link-icon" />
            <span className="aside__link-text">Усі фільми</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Aside;
