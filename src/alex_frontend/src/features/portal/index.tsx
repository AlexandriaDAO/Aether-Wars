import React, { useRef, useEffect, useState } from "react";
import { Pagination, PaginationProps } from "antd";
import { setCurrentPage } from "./portalSlice";
import BookCard from "./components/BookCard";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import fetchBooks from "./thunks/fetchBooks";
import useSession from "@/hooks/useSession";
import { ImSpinner8 } from "react-icons/im";
import BookModal, { Book } from "@/components/BookModal";

const ITEMS_PER_PAGE = 12;

const Portal: React.FC = () => {
	const {actor} = useSession();
	const dispatch = useAppDispatch();
	const { types, languages, eras } = useAppSelector(
		(state) => state.portalFilter
	);
	const { books, selectedBook, currentPage, searchTerm, loading, error } = useAppSelector(
		(state) => state.portal
	);
	const bookModalRef = useRef<HTMLDivElement>(null);

	// State to hold filtered books
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [paginatedBooks, setPaginatedBooks] = useState<Book[]>([]);

    useEffect(() => {
		if(books.length > 0 || !actor) return;
		dispatch(fetchBooks(actor));
	}, [books, actor, dispatch]);

	useEffect(() => {
        // Calculate total pages
        const pages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
        setTotalPages(pages);
    }, [filteredBooks]);


	useEffect(() => {
		// update paginated books
        const paginated = filteredBooks.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        setPaginatedBooks(paginated);
    }, [filteredBooks, currentPage]);


	useEffect(() => {

        // Filter books based on searchTerm, eras, languages, etc.
        const newFilteredBooks = books.filter((book:Book) => {
            // if search is empty, allow all books
            const matchesTitle = searchTerm.trim() === '' || book.title.toLowerCase().includes(searchTerm.toLowerCase());

            // if eras is empty allow books with any era
            const era = book.tags.find(tag => tag.name === 'era');
            const matchesEra = eras.length === 0 || (era && eras.some(er => era.value === er.value.toString()));

            // if languages is empty allow books with any language
            const language = book.tags.find(tag => tag.name === 'language');
            const matchesLanguage = languages.length === 0 || (language && languages.some(lang => language.value === lang.code));

            // if type is empty allow books with any type
            const type = book.tags.find(tag => tag.name === 'type');
            const matchesType = types.length === 0 || (type && types.some(t => type.value === t.id));

            // Return true if any of the conditions match
            return matchesTitle && matchesType && matchesEra && matchesLanguage;
        });

        setFilteredBooks(newFilteredBooks);
    }, [books, searchTerm, types, languages, eras]); // Dependencies include all relevant filter criteria

	const handlePageChange = (page: number) => {
		dispatch(setCurrentPage(page));
	};

	const renderPaginationItem: PaginationProps["itemRender"] = (
		_,
		type,
		originalElement
	) => {
		if (type === "prev") return <a className="px-2">Previous</a>;
		if (type === "next") return <a className="px-2">Next</a>;
		return originalElement;
	};

	const renderBookModal = (index: number) => {
		if (selectedBook) {
			const selectedBookIndex = paginatedBooks.findIndex(
				(b) => b.id === selectedBook.id
			);
			const isLastItem = index === paginatedBooks.length - 1;
			const isEndOfRow = (index + 1) % 6 === 0;

			if (isLastItem || isEndOfRow) {
				const rowStart = Math.floor(selectedBookIndex / 6) * 6;
				const rowEnd = Math.min(rowStart + 5, paginatedBooks.length - 1);

				if (index >= rowStart && index <= rowEnd) {
					return (
						<div
							key="book-modal"
							ref={bookModalRef}
							className="col-span-6"
						>
							<BookModal book={selectedBook} />
						</div>
					);
				}
			}
		}
		return null;
	};

	if(loading){
		return <div className="flex gap-1 justify-start items-center font-roboto-condensed text-base leading-[18px] text-black font-normal">
			<span>Loading Books</span>
			<ImSpinner8
				size={14}
				className="animate animate-spin"
			/>
		</div>

	}

	if(error){
		return <div className="flex flex-col gap-2 justify-start items-start font-roboto-condensed text-base leading-[18px] text-black font-normal">
			<span>Error loading books</span>
			<span>{error}</span>
		</div>
	}

	return (
		<>
			<div className="flex-grow grid grid-cols-6 grid-rows-[repeat(3, minmax(0,auto))] py-4 gap-4">
				{filteredBooks.length === 0 ? (
					<div className="col-span-6 font-roboto-condensed font-normal text-base flex items-center justify-between p-2 border-b last:border-0 text-black">
						No Results to show
					</div>
				) : (
					paginatedBooks.map((book, index) => (
						<React.Fragment key={book.id}>
							<BookCard book={book} />
							{renderBookModal(index)}
						</React.Fragment>
					))
				)}
			</div>
			{totalPages > 1 && (
				<div className="flex justify-center items-center my-10">
					<Pagination
						total={filteredBooks.length}
						current={currentPage}
						pageSize={ITEMS_PER_PAGE}
						showLessItems={true}
						onChange={handlePageChange}
						itemRender={renderPaginationItem}
					/>
				</div>
			)}
		</>
	);
};

export default Portal;
