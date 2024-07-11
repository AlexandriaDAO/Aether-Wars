import React, { useState } from "react";
import languages from "@/data/languages";
import CategorySelect from "./Fields/CategorySelect";

interface TagsProps {
  onTagsChange: (tags: any) => void;
}

const Tags: React.FC<TagsProps> = ({ onTagsChange }) => {
  const [metadata, setMetadata] = useState<any>({});
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetadata({ ...metadata, language: e.target.value });
    onTagsChange({ ...metadata, language: e.target.value });
  };

  const handleMetadataChange = (updatedMetadata: any) => {
    setMetadata(updatedMetadata);
    onTagsChange(updatedMetadata);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Title</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          type="text"
          id="title"
          placeholder="Book Title"
          value={metadata?.title || ""}
          onChange={(e) => handleMetadataChange({ ...metadata, title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="author">Author</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          type="text"
          id="author"
          placeholder="Author"
          value={metadata?.author || ""}
          onChange={(e) => handleMetadataChange({ ...metadata, author: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="fiction" className="flex items-center gap-2">
          <span>Fiction / Non-Fiction:</span>
          <div className="relative">
            <input
              type="checkbox"
              id="fiction"
              name="fiction"
              checked={metadata.fiction === undefined ? true : metadata.fiction}
              onChange={(e) => handleMetadataChange({ ...metadata, fiction: e.target.checked })}
              className="sr-only"
            />
            <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
            <div
              className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out"
              style={{ transform: metadata.fiction ? "translateX(100%)" : "translateX(0)" }}
            ></div>
          </div>
          <span>{metadata.fiction ? "Fiction" : "Non-Fiction"}</span>
        </label>
      </div>

      <div>
        <CategorySelect
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedMainCategory={selectedMainCategory}
          setSelectedMainCategory={setSelectedMainCategory}
          setMetadata={handleMetadataChange}
          metadata={metadata}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pubyear">Publication Year</label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              const currentYear = metadata?.pubyear ? parseInt(metadata.pubyear, 10) : 0;
              if (currentYear > -6000) {
                handleMetadataChange({ ...metadata, pubyear: currentYear - 1 });
              }
            }}
            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-l"
          >
            -
          </button>
          <input
            className="w-full px-4 py-2 text-center border border-gray-300"
            type="number"
            id="pubyear"
            placeholder="Year (e.g., 2022 or -500)"
            min="-6000"
            max="2050"
            step="1"
            value={metadata?.pubyear || ""}
            onChange={(e) => {
              const year = parseInt(e.target.value, 10);
              if (!isNaN(year) && year >= -6000 && year <= 2050) {
                handleMetadataChange({ ...metadata, pubyear: year });
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const currentYear = metadata?.pubyear ? parseInt(metadata.pubyear, 10) : 0;
              if (currentYear < 2050) {
                handleMetadataChange({ ...metadata, pubyear: currentYear + 1 });
              }
            }}
            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-r"
          >
            +
          </button>
        </div>
        <small className="text-gray-500">
          Note: Enter negative years for BC (e.g., -500 for 500 BC).
        </small>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          value={metadata.language || "en"}
          onChange={handleLanguageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tags;