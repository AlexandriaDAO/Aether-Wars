import React, { useEffect, useState } from "react";
import SearchBar from "../header/SearchBar";
import AuthorPanel from "../the-greats/AuthorPanel";
import AUTHOR_INFO from "../data/author_data";
import CardCreationPanel from "../components/CardCreationPanel/CardCreationPanel";

function Create() {
  const [selectedAuthors, setSelectedAuthors] = useState(
    AUTHOR_INFO.map((author) => author.id)
  );
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div className="h-full w-full relative">
      <SearchBar
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <CardCreationPanel />
      <div className="main-grid-container">
        <AuthorPanel
          authors={AUTHOR_INFO.filter(
            (author) =>
              selectedAuthors.includes(author.id) &&
              (selectedCategories.length === 0 ||
                selectedCategories.some((cat) => author.category.includes(cat)))
          )}
        />
      </div>
    </div>
  );
}

export default Create;
