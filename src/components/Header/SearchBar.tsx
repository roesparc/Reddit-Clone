import { IoSearchOutline } from "react-icons/io5";
import styles from "../../styles/header/SearchBar.module.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import useSearch from "../../hooks/useSearch";

const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const { isLoading, searchResults } = useSearch(searchTerm);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !inputRef.current?.contains(event.target as Node) &&
        !searchResultsRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={styles.root}
      style={
        showResults && searchTerm
          ? { borderRadius: "20px 20px 0 0" }
          : undefined
      }
    >
      <form className={styles.searchBarForm}>
        <label htmlFor="header-search-bar" className={styles.searchBarLabel}>
          <IoSearchOutline className={styles.searchBarIcon} />
        </label>

        <input
          className={styles.searchBarInput}
          type="search"
          id="header-search-bar"
          placeholder="Search"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </form>

      {showResults && searchTerm && (
        <div className={styles.searchResults} ref={searchResultsRef}>
          {isLoading ? (
            <ImSpinner2 className={styles.spinner} />
          ) : !searchResults.length ? (
            <p className={styles.noResults}>No results</p>
          ) : (
            searchResults.map((result, index) => (
              <Link
                key={index}
                to={result.url}
                className={styles.searchResult}
                onClick={() => setShowResults(false)}
              >
                <img src={result.img} alt="" />
                <p>{result.type + result.name}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
