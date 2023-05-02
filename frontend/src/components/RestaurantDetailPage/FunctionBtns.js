import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const FunctionBtns = () => {
  return (
    <div className="func-btns-container">
      <button className="write-review-btn">
        <FontAwesomeIcon icon="fa-solid fa-bone" />
        Write a review
      </button>
      <button>
        <FontAwesomeIcon icon="fa-solid fa-camera-retro" />
        Add photo
      </button>
      <button>
        <FontAwesomeIcon icon="fa-solid fa-heart" />
        Favorite
      </button>
    </div>
  );
};
export default FunctionBtns;
