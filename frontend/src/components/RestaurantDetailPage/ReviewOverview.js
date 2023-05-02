import Ratings from "../AllRestaurantsPage/Ratings/Ratings";
import YelpRating from "../YelpRating";
const ReviewOverview = ({ restaurantDetail }) => {
  const { avgRating, dogReviewCount, reviewCount, rating, name } =
    restaurantDetail;

  console.log(restaurantDetail, dogReviewCount);
  return (
    <div className="review-overview-container">
      <h2>Overall Rating</h2>
      <div className="ratings-container">
        <div className="dog-owner-rating-container">
          <p>BringDoggo Dog Friends Rating</p>
          <div className="rating-img-row">
            <Ratings avgRating={avgRating} />
            <p>{dogReviewCount}</p>
          </div>
        </div>
        <div className="yelp-rating-container">
          <p>Yelp Users Rating</p>
          <div className="rating-img-row">
            <YelpRating rating={rating} />
            <p>{reviewCount}</p>
          </div>
        </div>
        <p id="rating-sum">
          {name} has received a rating of {avgRating} out of 5 bones by{" "}
          {dogReviewCount} dog friends on BringDoggo and {rating} out of 5 by{" "}
          {reviewCount} users on Yelp.
        </p>
      </div>
    </div>
  );
};
export default ReviewOverview;
