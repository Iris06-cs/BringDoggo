import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Ratings from "./Ratings/Ratings";
import { useHistory } from "react-router-dom";

const Map = ({ currentPage }) => {
  const displayedRestaurants = useSelector(
    (state) => state.restaurants.displayRestaurants
  );
  //This sets the center of the map. This must be set BEFORE the map loads
  const averagePosition = Object.values(displayedRestaurants).reduce(
    (average, restaurant, index, array) => {
      average.lat += restaurant.lat / array.length;
      average.lng += restaurant.lng / array.length;
      return average;
    },
    { lat: 0, lng: 0 }
  );
  const [currentPosition, setCurrentPosition] = useState(averagePosition);
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
  });
  const containerStyle = {
    minWidth: "400px",
    height: "800px",
  };
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  const markerIcon = (idx) => {
    const markerIconInfo = {
      url: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${displayRestaurantIdx(
        idx
      )}|dd0a35|ffffff`, // URL of the marker image
      scaledSize: new window.google.maps.Size(30, 30),
    };
    return markerIconInfo;
  };
  const history = useHistory();
  const handleMarkerClick = (restaurantId) => {
    history.push(`/restaurants/${restaurantId}`);
  };

  return (
    <div className="google-map-container">
      <div>
        {isLoaded && displayedRestaurants && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={12}
            center={currentPosition}
            onUnmount={onUnmount}
          >
            {Object.values(displayedRestaurants).map((restaurant, idx) => (
              <Marker
                key={idx}
                position={{ lat: restaurant.lat, lng: restaurant.lng }}
                // title={restaurant.name}
                streetView={false}
                icon={markerIcon(idx)}
                onMouseOver={() => setActiveMarker(restaurant)}
                onMouseOut={() => setActiveMarker(null)}
                onClick={() => handleMarkerClick(restaurant.id)}
              >
                {activeMarker === restaurant && (
                  <InfoWindow
                    position={{ lat: restaurant.lat, lng: restaurant.lng }}
                  >
                    <div>
                      <h3>{restaurant.name}</h3>
                      <div className="rating-count-container">
                        <Ratings avgRating={restaurant.avgRating} />
                        <p className="restaurant-dog-review-count">
                          {restaurant.dogReviewCount}
                        </p>
                        <span>{restaurant.price}</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};
export default Map;
