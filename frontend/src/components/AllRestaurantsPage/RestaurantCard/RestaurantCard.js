import Ratings from "../Ratings/Ratings";
import haruMenu from "../../../image/haru-menu.jpg";
import "./RestaurantCard.css";
import { NavLink } from "react-router-dom";

const RestaurantCard = ({ restaurant, idx }) => {
  const { id, name, price, dogReviewCount, avgRating, address } = restaurant;

  return (
    <div className="restaurant-card-container">
      {/* <img alt="restaurant" src={}/> */}
      <img
        alt="*"
        src={haruMenu}
        style={{ width: "100%", objectFit: "fill", objectPosition: "top" }}
      />
      <div className="restaurant-info-container">
        <NavLink to={`/restaurants/${id}`} className="restaurant-name">
          {idx}.{name} <span className="restaurant-price">{price}</span>
        </NavLink>

        <div className="rating-count-container">
          <Ratings avgRating={avgRating} />
          <p className="restaurant-dog-review-count">{dogReviewCount}</p>
        </div>
        <p>ph neiborhood</p>
      </div>
    </div>
  );
};
export default RestaurantCard;
