import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import haruMenu from "../../image/haru-menu.webp";
import convertTimeFormat from "../../utils/convertTimeFormat";
import Ratings from "../AllRestaurantsPage/Ratings/Ratings";
import OpenModalButton from "../OpenModalButton";
import ImageModal from "./ImageModal";
import LoadingSpinner from "../LoadingSpinner";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";

const TopSection = ({ restaurantDetail }) => {
  const images = useSelector((state) => state.restaurantImages.imageById);
  const { name, avgRating, categories, dogReviewCount, price, hours } =
    restaurantDetail;
  const [currResImges, setCurrResImges] = useState();
  const [openTime, setOpenTime] = useState();
  const [isOpen, setIsOpen] = useState();
  const currDay = new Date();
  const today = currDay.getDay();
  const currHour = currDay.getHours();
  const currMinut = currDay.getMinutes();
  const curr24hTime = currHour * 100 + currMinut;
  const todayHours =
    hours && hours.length > 0 ? hours[0].open[today - 1] : undefined; //object
  useEffect(() => {
    if (images) {
      setCurrResImges(
        Object.values(images).filter(
          (img) => img.restaurantId === restaurantDetail.id
        )
      );
    }
  }, [images, restaurantDetail]);
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
  if (currResImges === undefined) return <LoadingSpinner />;
  return (
    <div className="page-top-section">
      <div className="image-container">
        {currResImges.length > 0 &&
          currResImges.map(
            (img, idx) => idx <= 6 && <img key={idx} alt="*" src={img.url} />
          )}
        <img alt="*" src={haruMenu} />
      </div>
      <div className="restaurant-detail-info-container">
        <p>{name}</p>
        <div className="info-row-container">
          <Ratings avgRating={avgRating} />
          <span>{dogReviewCount}</span>
        </div>
        <div className="info-row-container">
          <p>{price}</p>
          {categories.length &&
            categories.map((category, idx) => (
              // change it to link later, query search
              <span key={idx}>{category.title} </span>
            ))}
        </div>

        {openTime && (
          <p>
            <span id="open-tag">{isOpen ? "Open" : "Closed"}</span>
            {openTime}
          </p>
        )}
      </div>
      <div className="all-photo-btn">
        <OpenModalButton
          buttonText={
            <>
              <FontAwesomeIcon icon={faCameraRetro} className="display-bone" />
              See All Photos
            </>
          }
          modalComponent={
            <ImageModal currResImges={currResImges} name={name} />
          }
        />
      </div>
    </div>
  );
};
export default TopSection;
