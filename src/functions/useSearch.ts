import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";

interface SearchItem {
  name: string;
  img: string;
  url: string;
  type: string;
}

const useSearch = (searchTerm: string) => {
  const [availableSearchItems, setAvailableSearchItems] = useState<
    Array<SearchItem>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Array<SearchItem>>([]);

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, "subre_edits"))),
      getDocs(query(collection(db, "users"))),
    ]).then(([communitiesSnap, usersSnap]) => {
      const communitiesSearchItems = communitiesSnap.docs.map((doc) => ({
        name: doc.data().name,
        img: doc.data().img,
        url: `/r/${doc.data().name}`,
        type: "r/",
      }));

      const usersSearchItems = usersSnap.docs.map((doc) => ({
        name: doc.data().username,
        img: doc.data().userImg,
        url: `/user/${doc.data().username}`,
        type: "u/",
      }));

      setAvailableSearchItems(communitiesSearchItems.concat(usersSearchItems));
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (!availableSearchItems.length || !searchTerm) return;

    const results = availableSearchItems.filter((SearchItem) =>
      SearchItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
    setIsLoading(false);
  }, [searchTerm, availableSearchItems]);

  return {
    isLoading,
    searchResults,
  };
};

export default useSearch;
