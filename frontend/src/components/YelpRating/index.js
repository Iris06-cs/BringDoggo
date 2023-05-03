import regular_0 from "./yelpstars/regular_0.png";
import regular_1 from "./yelpstars/regular_1.png";
import regular_1_half from "./yelpstars/regular_1_half.png";
import regular_2 from "./yelpstars/regular_2.png";
import regular_3 from "./yelpstars/regular_3.png";
import regular_4 from "./yelpstars/regular_4.png";
import regular_5 from "./yelpstars/regular_5.png";
import regular_2_half from "./yelpstars/regular_2_half.png";
import regular_3_half from "./yelpstars/regular_3_half.png";
import regular_4_half from "./yelpstars/regular_4_half.png";
import yelp_logo from "./yelp_logo.png";
import "./YelpRating.css";
const YelpRating = ({ rating }) => {
  const yelpRating = (rating) => {
    if (rating <= 1)
      return (
        <img alt="rating" src={regular_0} className="rating-icon-img yelp" />
      );
    else if (rating === 1)
      return (
        <img alt="rating" src={regular_1} className="rating-icon-img yelp" />
      );
    else if (rating < 2)
      return (
        <img
          alt="rating"
          src={regular_1_half}
          className="rating-icon-img yelp"
        />
      );
    else if (rating === 2)
      return (
        <img alt="rating" src={regular_2} className="rating-icon-img yelp" />
      );
    else if (rating < 3)
      return (
        <img
          alt="rating"
          src={regular_2_half}
          className="rating-icon-img yelp"
        />
      );
    else if (rating === 3)
      return (
        <img alt="rating" src={regular_3} className="rating-icon-img yelp" />
      );
    else if (rating < 4)
      return (
        <img
          alt="rating"
          src={regular_3_half}
          className="rating-icon-img yelp"
        />
      );
    else if (rating === 4)
      return (
        <img alt="rating" src={regular_4} className="rating-icon-img yelp" />
      );
    else if (rating < 5)
      return (
        <img
          alt="rating"
          src={regular_4_half}
          className="rating-icon-img yelp"
        />
      );
    else if (rating === 5)
      return (
        <img alt="rating" src={regular_5} className="rating-icon-img yelp" />
      );
  };

  return (
    <>
      <img alt="yelp-logo" src={yelp_logo} id="yelp-logo" />
      <div className="rating-icon-img-container">{yelpRating(rating)}</div>
    </>
  );
};
export default YelpRating;
