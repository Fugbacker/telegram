// components/LiveSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import style from "../styles/File.module.css";
import photoChecker from "../public/images/default.png";

const LiveSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  const formatNumber = (num) => {
    if (num == null || isNaN(num)) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  const getAvatarUrl = (avatarData) => {
    if (!avatarData) return "/default.png";
    return `data:image/jpeg;base64,${avatarData}`;
  };

  useEffect(() => {
    if (query.length >= 3) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          // Запрос к новому API
          const response = await fetch(
            `/api/searchChannels?query=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
          const data = await response.json();
          setResults(data.channels || []);
          setShowResults(true);
        } catch (err) {
          console.error("Ошибка поиска:", err);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        resultsContainerRef.current &&
        !resultsContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (username) => {
    if (username) window.location.href = `/channel/${username}`;
  };

  return (
    <div className={style.searchContainer}>
        <div className={style.searchWrapper}>
          поиск каналов, групп и чатов по названию или ключевым словам
        </div>
      <div className={style.liveSearchContainer}>
        <div className={style.liveSearchInputWrapper} ref={inputRef}>
          <FaSearch className={style.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && setShowResults(true)}
            placeholder="Поиск каналов..."
            className={style.liveSearchInput}
          />
          {isLoading && <div className={style.liveSearchLoader}>Ищем...</div>}
        </div>

        {showResults && (
          <div className={style.liveSearchResultsContainer} ref={resultsContainerRef}>
            <div className={style.liveSearchResultsList}>
              {results.length > 0 ? (
                results.slice(0, 10).map((channel, index) => (
                  <div
                    key={channel.id || index}
                    className={style.liveSearchResultItem}
                    onClick={() => handleResultClick(channel.username)}
                  >
                    <img
                      src={getAvatarUrl(channel.avatarData)}
                      alt={channel.title}
                      className={style.liveSearchResultAvatar}
                      onError={(e) => {
                        e.target.src = photoChecker.src;
                        e.target.onerror = null;
                      }}
                    />
                    <div className={style.liveSearchResultInfo}>
                      <div className={style.liveSearchResultTitle}>
                        {channel.title}
                      </div>
                      <div className={style.liveSearchResultUsername}>
                        @{channel.username}
                      </div>
                      <div className={style.liveSearchResultSubscribers}>
                        {formatNumber(
                          channel.subscribers || channel.participantsCount
                        )}{" "}
                        подписчиков
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !isLoading && (
                  <div className={style.liveSearchNoResults}>Ничего не найдено</div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default LiveSearch;
