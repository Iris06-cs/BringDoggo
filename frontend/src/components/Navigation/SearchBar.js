import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = () => {
  return (
    <form id="search-bar">
      <input
        type="text"
        placeholder="sushi,brunch,tacos..."
        id="search-bar-left"
      />
      <input type="text" placeholder="San Diego,CA" />
      <button type="submit" id="searchbar-btn" className="general-button">
        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
      </button>
    </form>
  );
};

export default SearchBar;
