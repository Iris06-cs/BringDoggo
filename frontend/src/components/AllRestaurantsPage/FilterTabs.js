import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBone,
  faCircleXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

const FilterTabs = ({
  setSelectedRating,
  selectedRating,
  selectedPrice,
  setSelectedPrice,
  sortBy,
  setSortBy,
}) => {
  const toolkitText = ["5 only", "4 & up", "3 & up", "2 & up", "1 & up"];
  const onClickIcon = (bones) => {
    setSelectedRating(bones);
  };
  const [option, setOption] = useState(false);
  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-sorter-all-container">
      <div className="filter-all-container">
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
              <FontAwesomeIcon icon={faCircleXmark} />
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
                  icon={faBone}
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
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}
        </div>
      </div>

      <div className="custom-selection">
        <div className="curr-sort-by" onClick={() => setOption(true)}>
          Sort:
          {sortBy === "mostRated" && (
            <span className="selected-sort">Most Rated</span>
          )}
          {sortBy === "highestRating" && (
            <span className="selected-sort">Highest Rating</span>
          )}
          {sortBy === "" && <span className="selected-sort">Yelp Popular</span>}
        </div>
        <div
          ref={dropdownRef}
          className={"sort-options" + (option ? "" : " hidden")}
        >
          <div
            onClick={() => {
              setSortBy("");
              setOption(false);
            }}
          >
            Yelp Popular
            {sortBy === "" && <FontAwesomeIcon icon={faCheck} />}
          </div>
          <div
            onClick={() => {
              setSortBy("mostRated");
              setOption(false);
            }}
          >
            Most Rated
            {sortBy === "mostRated" && <FontAwesomeIcon icon={faCheck} />}
          </div>
          <div
            onClick={() => {
              setSortBy("highestRating");
              setOption(false);
            }}
          >
            Highest Rating
            {sortBy === "highestRating" && <FontAwesomeIcon icon={faCheck} />}
          </div>
        </div>
      </div>
      <div className="sorter-all-container"></div>
    </div>
  );
};
export default FilterTabs;
