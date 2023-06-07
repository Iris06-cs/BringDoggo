import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  searchRestaurants,
  setCurrentPage,
  submitSearch,
} from "../../store/restaurants";

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchSuggestion = useSelector(
    (state) => state.restaurants.searchResults
  );
  const searchRecommend = useSelector(
    (state) => state.restaurants.searchRecommend
  );
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [isFocusKeyword, setIsFocusKeyword] = useState(false);
  const [isFocusLocation, setIsFocusLocation] = useState(false);
  const [autocomplete, setAutocomplete] = useState([]);

  useEffect(() => {
    dispatch(searchRestaurants({ keyword, location }));
  }, [dispatch, location, keyword]);

  useEffect(() => {
    if (searchRecommend.length > 5) {
      setAutocomplete(searchRecommend.slice(0, 5));
    } else if (searchRecommend.length > 0 && searchRecommend.length < 5) {
      setAutocomplete(searchRecommend);
    } else if (searchRecommend.length === 0) setAutocomplete([]);
  }, [searchRecommend]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitSearch());
    dispatch(setCurrentPage(1));
  };
  const chooseSuggestedWord = (e, word) => {
    e.preventDefault();
    dispatch(searchRestaurants({ keyword: word, location }));
    dispatch(submitSearch());
    dispatch(setCurrentPage(1));
    setIsFocusKeyword(false);
    setKeyword(autocomplete[0]);
  };
  return (
    <>
      <form id="search-bar" onSubmit={handleSubmit}>
        <div className="search-bar-input-container">
          {autocomplete.length > 0 && (
            <input
              type="text"
              style={{
                position: "absolute",
                backgroundColor: "transparent",
                color: "lightgrey",
                zIndex: 1,
              }}
              value={autocomplete[0].toLowerCase()}
              disabled
            />
          )}
          <input
            type="text"
            value={keyword.toLocaleLowerCase()}
            placeholder="sushi, brunch, tacos..."
            id="search-bar-left"
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={(e) => setIsFocusKeyword(true)}
            // onBlur={(e) => setIsFocusKeyword(false)}
          />
        </div>
        <div className="search-bar-input-container">
          {autocomplete.length > 0 && (
            <input
              type="text"
              style={{
                position: "absolute",
                backgroundColor: "transparent",
                color: "lightgrey",
                zIndex: 1,
              }}
              value={autocomplete[0].toLowerCase()}
              disabled
            />
          )}
          <input
            type="text"
            value={location.toLocaleLowerCase()}
            placeholder="address, neighborhood, zip..."
            onChange={(e) => setLocation(e.target.value)}
            onFocus={(e) => setIsFocusLocation(true)}
            onBlur={(e) => setIsFocusLocation(false)}
          />
        </div>
        <button type="submit" id="searchbar-btn" className="general-button">
          <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </form>
      {(keyword || location) && (
        <div className="autocomplete-dropdown">
          <div className="search-dropdown">
            <div
              className={
                "search-by-keyword" + (isFocusKeyword ? "" : " hidden")
              }
            >
              <p>Best matches for you:</p>
              <ul>
                {autocomplete.length > 0 &&
                  autocomplete.map((word) => (
                    <li
                      key={word}
                      onClick={(e) => chooseSuggestedWord(e, word)}
                    >
                      {word}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="search-dropdown">
            <div
              className={
                "search-by-location" + (isFocusLocation ? "" : " hidden")
              }
            >
              <p>Best matches for you:location</p>
              {/* current location */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
