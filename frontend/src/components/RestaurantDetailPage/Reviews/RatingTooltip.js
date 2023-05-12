import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavLink, useParams } from "react-router-dom";

const RatingTooltip = ({ restaurantName }) => {
  const { restaurantId } = useParams();
  const toolkitText = ["Great", "Good", "Ok", "Not Good", "Bad"];

  return (
    <>
      {/* hover over to show rating ratio,onclick=>add review page/login */}
      <div className="rating-bone-container">
        {toolkitText.map((text, idx) => (
          <div className="single-bone-container" key={idx}>
            <NavLink
              className="bone-btn-link"
              to={`/restaurants/${restaurantId}/reviews/new?name=${restaurantName}&rating=${
                5 - idx
              }`}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-bone"
                style={{ transform: "rotate(135deg)" }}
              />
            </NavLink>
            <span className="tooltip-text">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
export default RatingTooltip;
