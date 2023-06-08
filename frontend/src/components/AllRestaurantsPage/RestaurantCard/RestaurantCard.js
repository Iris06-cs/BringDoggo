import Ratings from "../Ratings/Ratings";
import haruMenu from "../../../image/haru-menu.jpg";
import "./RestaurantCard.css";
import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";

const RestaurantCard = ({ restaurant, idx }) => {
  const { id, name, price, dogReviewCount, avgRating, previewImg } = restaurant;
  console.log(previewImg, "9");
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
  return (
    <div className="restaurant-card-container">
      {previewImg && (
        <img
          alt="restaurant"
          src={previewImg.url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            objectPosition: "top",
            zIndex: "-1",
          }}
        />
      )}
      {!previewImg && (
        <img
          alt="*"
          src={haruMenu}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            objectPosition: "top",
            zIndex: "-1",
          }}
        />
      )}
      <div className="restaurant-info-container">
        <NavLink to={`/restaurants/${id}`} className="restaurant-name">
          {idx}.{name}
        </NavLink>

        <div className="rating-count-container">
          <Ratings avgRating={avgRating} />
          <p className="restaurant-dog-review-count">{dogReviewCount}</p>
          <span className="restaurant-price">{price}</span>
        </div>
        {/* <p>{neighborhood}</p> */}
      </div>
    </div>
  );
};
export default RestaurantCard;
