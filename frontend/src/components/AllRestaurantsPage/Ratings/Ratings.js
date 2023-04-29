import bone0 from "../../../image/bone-0.png";
import bone0half from "../../../image/bone-half.png";
import bone1 from "../../../image/bone-1.png";
import bone1half from "../../../image/bone-1-half.png";
import bone2 from "../../../image/bone-2.png";
import bone2half from "../../../image/bone-2-half.png";
import bone3 from "../../../image/bone-3.png";
import bone3half from "../../../image/bone-3-half.png";
import bone4 from "../../../image/bone-4.png";
import bone4half from "../../../image/bone-4-half.png";
import bone5 from "../../../image/bone-5.png";
import "./Ratings.css";
const Ratings = ({ avgRating }) => {
  const rating = (avgRating) => {
    if (avgRating === 0)
      return <img alt="rating" src={bone0} className="rating-icon-img" />;
    else if (avgRating < 1)
      return <img alt="rating" src={bone0half} className="rating-icon-img" />;
    else if (avgRating === 1)
      return <img alt="rating" src={bone1} className="rating-icon-img" />;
    else if (avgRating < 2)
      return <img alt="rating" src={bone1half} className="rating-icon-img" />;
    else if (avgRating === 2)
      return <img alt="rating" src={bone2} className="rating-icon-img" />;
    else if (avgRating < 3)
      return <img alt="rating" src={bone2half} className="rating-icon-img" />;
    else if (avgRating === 3)
      return <img alt="rating" src={bone3} className="rating-icon-img" />;
    else if (avgRating < 4)
      return <img alt="rating" src={bone3half} className="rating-icon-img" />;
    else if (avgRating === 4)
      return <img alt="rating" src={bone4} className="rating-icon-img" />;
    else if (avgRating < 5)
      return <img alt="rating" src={bone4half} className="rating-icon-img" />;
    else if (avgRating === 5)
      return <img alt="rating" src={bone5} className="rating-icon-img" />;
  };

  return <div className="rating-icon-img-container">{rating(avgRating)}</div>;
};
export default Ratings;
