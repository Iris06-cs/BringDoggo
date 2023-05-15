import React, { useState, useCallback } from "react";
// import { useSelector } from "react-redux";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
const LocationMap = ({ restaurantDetail }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: restaurantDetail.lat,
    lng: restaurantDetail.lng,
  });
  const [map, setMap] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
  });
  const containerStyle = {
    minWidth: "320px",
    height: "240px",
  };
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={12}
            center={currentPosition}
            onUnmount={onUnmount}
          >
            <Marker
              position={{
                lat: restaurantDetail.lat,
                lng: restaurantDetail.lng,
              }}
              streetView={false}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
};
export default LocationMap;
