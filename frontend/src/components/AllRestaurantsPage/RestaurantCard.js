import Ratings from "./Ratings/Ratings";
const RestaurantCard = ({ restaurant, idx }) => {
  const { id, name, price, dogReviewCount, avgRating, address } = restaurant;

  return (
    <div className="restaurant-card-container">
      {/* <img alt="restaurant" src={}/> */}
      <p>ph image</p>
      <p className="restaurant-name">
        {idx}.{name}
      </p>
      <span className="restaurant-price">{price}</span>
      <Ratings avgRating={avgRating} />
      <p className="restaurant-dog-review-count">{dogReviewCount}</p>
      <p>ph neiborhood</p>
    </div>
  );
};
export default RestaurantCard;
