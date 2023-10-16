import { useState, useEffect } from 'react';
import { useAuthors } from '../src/contexts/AuthorContext';
import { Book } from '../src/cards/MessageCard/types';
import { sanitizeTitleForPath } from './handleReadBookClick';

const useAuthorBooks = (authorId: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const { authors } = useAuthors();

  useEffect(() => {
    const authorInfo = authors.find(info => info.id === authorId);
    const booksForAuthor: Book[] = [];

    authorInfo?.books?.forEach((title, index) => {
      booksForAuthor.push({
        author: authorId,
        description: authorInfo.book_descriptions?.[index] || "Description not available",
        categories: authorInfo.category || [],
        imagePath: `/bookimages/${authorId}/${sanitizeTitleForPath(title)}.png`,
        title: title,
      });
    });

    setBooks(booksForAuthor);
  }, [authorId, authors]);

  return books;
};

export default useAuthorBooks;
