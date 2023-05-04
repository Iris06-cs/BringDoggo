import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useParams } from "react-router-dom";
const RatingTooltip = ({ restaurantName }) => {
  const { restaurantId } = useParams();
  return (
    <>
      {/* hover over to show rating ratio,onclick=>add review page/login */}
      <div className="rating-bone-container">
        <div className="single-bone-container">
          <NavLink
            className="bone-btn-link"
            to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${5}`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />
          </NavLink>
          <span className="tooltip-text">Great</span>
        </div>
        <div className="single-bone-container">
          <NavLink
            className="bone-btn-link"
            to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${4}`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />
          </NavLink>
          <span className="tooltip-text">Good</span>
        </div>
        <div className="single-bone-container">
          <NavLink
            className="bone-btn-link"
            to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${3}`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />
          </NavLink>
          <span className="tooltip-text">Ok</span>
        </div>
        <div className="single-bone-container">
          <NavLink
            className="bone-btn-link"
            to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${2}`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />
          </NavLink>
          <span className="tooltip-text">Not Good</span>
        </div>
        <div className="single-bone-container">
          <NavLink
            className="bone-btn-link"
            to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${1}`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />
          </NavLink>
          <span className="tooltip-text">Bad</span>
        </div>
      </div>
    </>
  );
};
export default RatingTooltip;
