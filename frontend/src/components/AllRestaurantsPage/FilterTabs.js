import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { filterRestaurantByRating } from "../../store/restaurants";

const FilterTabs = ({
  setSelectedRating,
  selectedRating,
  selectedPrice,
  setSelectedPrice,
}) => {
  const toolkitText = ["5 only", "4 & up", "3 & up", "2 & up", "1 & up"];
  const onClickIcon = (bones) => {
    setSelectedRating(bones);
  };
  return (
    <div className="filter-sorter-all-container">
      <div className="filter-all-container">
        {/* <button>Categories</button>
        <ul className="category-dropdown">
          <li>Thai</li>
        </ul> */}
        <div className="price-btn-container">
          <button
            className={
              "price-btn first" + (selectedPrice === "$" ? " selected" : "")
            }
            onClick={() => setSelectedPrice("$")}
          >
            $
          </button>
          <button
            className={
              "price-btn" + (selectedPrice === "$$" ? " selected" : "")
            }
            onClick={() => setSelectedPrice("$$")}
          >
            $$
          </button>
          <button
            className={
              "price-btn" + (selectedPrice === "$$$" ? " selected" : "")
            }
            onClick={() => setSelectedPrice("$$$")}
          >
            $$$
          </button>
          <button
            className={
              "price-btn last" + (selectedPrice === "$$$$" ? " selected" : "")
            }
            onClick={() => setSelectedPrice("$$$$")}
          >
            $$$$
          </button>
          {selectedPrice && (
            <button
              className="clear-filter-btn"
              onClick={() => setSelectedPrice()}
            >
              <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>
        <div className="rating-btn-container">
          <div className="rating-bone-container">
            {toolkitText.map((text, idx) => (
              <div
                className={`single-bone-container ${
                  selectedRating >= 5 - idx ? "selected" : ""
                }`}
                key={idx}
                onClick={() => onClickIcon(5 - idx)}
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">{text}</span>
              </div>
            ))}
          </div>
          {selectedRating && (
            <button
              className="clear-filter-btn"
              onClick={() => setSelectedRating()}
            >
              <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>
      </div>
      <div className="sorter-all-container"></div>
    </div>
  );
};
export default FilterTabs;
