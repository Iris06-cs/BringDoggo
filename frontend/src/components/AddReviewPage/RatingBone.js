import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const RatingBone = ({
  selectedRating,
  setSelectedRating,
  currRating,
  setCurrRating,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const onClickIcon = (bones) => {
    setSelectedRating(bones);
    setCurrRating(bones);
  };
  const onMouseIn = (bones) => setHoverRating(bones);

  const onMouseOut = () => setHoverRating(0);

  const toolkitText = ["Great", "Good", "Ok", "Not Good", "Bad"];
  console.log(currRating);

  const displayBones = (hoverRating, currRating, selectedRating) => {
    let res;
    if (hoverRating > 0) res = hoverRating;
    else if (currRating) res = currRating;
    else res = selectedRating;
    return res;
  };
  return (
    <>
      {/* hover over to show rating ratio,onclick=>add review page/login */}
      <div className="rating-bone-container">
        {toolkitText.map((text, idx) => (
          <div
            className={`single-bone-container ${
              displayBones(hoverRating, currRating, selectedRating) >= 5 - idx
                ? "selected"
                : ""
            }`}
            key={idx}
            onClick={() => onClickIcon(5 - idx)}
            onMouseEnter={() => onMouseIn(5 - idx)}
            onMouseLeave={onMouseOut}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-bone"
              style={{ transform: "rotate(135deg)" }}
            />

            <span className="tooltip-text">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
export default RatingBone;
