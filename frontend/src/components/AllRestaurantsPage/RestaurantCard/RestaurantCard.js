import Ratings from "../Ratings/Ratings";
import haruMenu from "../../../image/haru-menu.jpg";
import "./RestaurantCard.css";
import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const RestaurantCard = ({ restaurant, idx, currentHover, setCurrentHover }) => {
  const {
    id,
    name,
    price,
    dogReviewCount,
    avgRating,
    previewImg,
    categories,
    is_closed,
  } = restaurant;

  // const [neighborhood, setNeighborhood] = useState();
  // const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API;
  // const getNeighborhood = async (lat, lng) => {
  //   console.log(lat, lng);
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=neighborhood&key=${googleAPI}`
  //     );
  //     const data = await response.json();

  //     const results = data.results;
  //     console.log(results, "19");
  //     if (results[0]) {
  //       const addressComponents = results[0].address_components;
  //       const neighborhood = addressComponents.find((component) =>
  //         component.types.includes("neighborhood")
  //       );

  //       if (neighborhood) {
  //         return neighborhood.long_name;
  //       }
  //     }

  //     return null;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getNeighborhood(lat, lng).then((data) => setNeighborhood(data));
  // }, [lat, lng]);
  // console.log(neighborhood);
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/restaurants/${id}`);
  };
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
              <span className="restaurant-price">{price}</span>
            </div>
            <div className="info-item">
              <span className="open-tag">
                {is_closed ? "Closed" : "Open Now"}
              </span>
            </div>
            <div className="info-item">
              {categories.length &&
                categories.map((category, idx) => (
                  // change it to link later, query search
                  <span className="category" key={idx}>
                    {category.title}{" "}
                  </span>
                ))}
            </div>
            <div></div>
            {/* <p>{neighborhood}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantCard;
