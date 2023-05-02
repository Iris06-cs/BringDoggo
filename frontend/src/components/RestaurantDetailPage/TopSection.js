import haruMenu from "../../image/haru-menu.jpg";
import Ratings from "../AllRestaurantsPage/Ratings/Ratings";

const TopSection = ({ restaurantDetail }) => {
  const { name, avgRating, categories, dogReviewCount, price, hours } =
    restaurantDetail;
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
        <p>hours placeholder</p>
      </div>
    </div>
  );
};
export default TopSection;
