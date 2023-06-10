import Ratings from "../Ratings/Ratings";
import haruMenu from "../../../image/haru-menu.webp";
import "./RestaurantCard.css";
import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import convertTimeFormat from "../../../utils/convertTimeFormat";
const RestaurantCard = ({ restaurant, idx, currentHover, setCurrentHover }) => {
  const {
    id,
    name,
    price,
    dogReviewCount,
    avgRating,
    previewImg,
    categories,
    hours,
    lat,
    lng,
    address,
  } = restaurant;

  const [neighborhood, setNeighborhood] = useState();

  useEffect(() => {
    const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API;
    const getNeighborhood = async (lat, lng) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleAPI}`
      );

      const data = await response.json();
      const results = data.results;
      if (results[0]) {
        const addressComponents = results[0].address_components;
        const neighborhood = addressComponents.find((component) =>
          component.types.includes("neighborhood")
        );

        if (neighborhood) {
          return neighborhood.long_name;
        }
        const locality = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_2")
        );

        if (locality) {
          return locality.long_name;
        }

        return address;
      }
    };
    getNeighborhood(lat, lng).then((data) => setNeighborhood(data));
  }, [lat, lng, address]);
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/restaurants/${id}`);
  };
  const [isOpen, setIsOpen] = useState();
  const [openTime, setOpenTime] = useState();
  const currDay = new Date();
  const today = currDay.getDay();
  const currHour = currDay.getHours();
  const currMinut = currDay.getMinutes();
  const curr24hTime = currHour * 100 + currMinut;
  const todayHours =
    hours && hours.length > 0 ? hours[0].open[today - 1] : undefined;

  useEffect(() => {
    if (todayHours)
      setOpenTime(
        `${convertTimeFormat(todayHours.start)}-${convertTimeFormat(
          todayHours.end
        )}`
      );
  }, [todayHours]);
  useEffect(() => {
    const checkIsOpen = () => {
      const startTime = parseInt(todayHours.start, 10);
      const endTime = parseInt(todayHours.end, 10);
      setIsOpen(curr24hTime >= startTime && curr24hTime <= endTime);
    };
    if (todayHours) {
      checkIsOpen();
      const timer = setInterval(() => {
        checkIsOpen();
      }, 60000); //check every min
      return () => clearInterval(timer);
    }
  }, [curr24hTime, todayHours]);
  return (
    <div className="restaurant-card-container">
      <div
        className="restaurant-card"
        onClick={handleCardClick}
        onMouseOver={() => setCurrentHover(id)}
        onMouseOut={() => setCurrentHover(null)}
      >
        <div className="restaurant-card-img">
          {previewImg && <img alt="restaurant" src={previewImg.url} />}
          {!previewImg && <img alt="*" src={haruMenu} />}
        </div>
        <div>
          <div className="restaurant-info-container">
            <NavLink to={`/restaurants/${id}`} className="restaurant-name">
              {idx}.{name}
            </NavLink>

            <div className="rating-count-container">
              <Ratings avgRating={avgRating} />
              <p className="restaurant-dog-review-count">{dogReviewCount}</p>
            </div>
            <div className="info-item">
              <p>
                {openTime && (
                  <span className="open-tag">{isOpen ? "Open" : "Closed"}</span>
                )}
                {openTime}
              </p>
            </div>
            <div className="info-item">
              {categories.length &&
                categories.map((category, idx) => (
                  <span className="category" key={idx}>
                    {category.title}{" "}
                  </span>
                ))}
              <span className="restaurant-price">{price}</span>
            </div>
            <div className="info-item last">
              <p>{neighborhood}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantCard;
