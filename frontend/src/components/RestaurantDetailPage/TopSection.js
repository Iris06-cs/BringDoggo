import { useEffect, useState } from "react";
import haruMenu from "../../image/haru-menu.jpg";
import convertTimeFormat from "../../utils/convertTimeFormat";
import Ratings from "../AllRestaurantsPage/Ratings/Ratings";

const TopSection = ({ restaurantDetail }) => {
  const { name, avgRating, categories, dogReviewCount, price, hours } =
    restaurantDetail;
  const [openTime, setOpenTime] = useState();
  const [isOpen, setIsOpen] = useState();
  const currDay = new Date();
  const today = currDay.getDay();
  const currHour = currDay.getHours();
  const currMinut = currDay.getMinutes();
  const curr24hTime = currHour * 100 + currMinut;
  const todayHours = hours.length > 0 ? hours[0].open[today - 1] : undefined; //object
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
    checkIsOpen();
    const timer = setInterval(() => {
      checkIsOpen();
    }, 60000); //check every min
    return () => clearInterval(timer); //clean up
  }, [curr24hTime, todayHours]);
  return (
    <div className="page-top-section">
      <div>
        <img
          alt="*"
          src={haruMenu}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "contain",
            objectPosition: "left",
            zIndex: "-1",
          }}
        />
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
        {/* need to show open/closed + hours, if open show current day open time, if closed show next day open time, as a link to click to the hours section */}
        {openTime && (
          <p>
            <span id="open-tag">{isOpen ? "Open" : "Closed"}</span>
            {openTime}
          </p>
        )}
      </div>
    </div>
  );
};
export default TopSection;
