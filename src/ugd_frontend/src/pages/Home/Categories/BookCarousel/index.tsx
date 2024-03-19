import React, { useState, useRef, useEffect, LegacyRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBook } from "@/features/home/homeSlice";
// Sample data for the books
const books = [
	{
        key: 1,
		title: "Sapiens",
		author: "Yuval Noah Harari",
		image: "sapiens.png",
	},
	{
        key: 2,
		title: "Brave New World",
		author: "Aldous Huxley",
		image: "brave-new-world.png",
	},
	{
        key: 3,
		title: "Meditations",
		author: "Marcus Aurelius",
		image: "meditations.png",
	},
	{
        key: 4,
		title: "1984",
		author: "George Orwell",
		image: "1984.png",
	},
	{
        key: 5,
		title: "Sapiens",
		author: "Yuval Noah Harari",
		image: "sapiens.png",
	},
	{
        key: 6,
		title: "1984",
		author: "George Orwell",
		image: "1984.png",
	},
	{
        key: 7 ,
		title: "lorem",
		author: "Drake Bins",
		image: "brave-new-world.png",
	},
	{
        key: 8,
		title: "Meditations",
		author: "Marcus Aurelius",
		image: "placeholder-cover.png",
	},
];

export default function BooksCarousel() {

    const dispatch = useAppDispatch();
    const {selectedBook} = useAppSelector(state=>state.home)

    const handleBookClick = (book:any)=>{
        if (selectedBook && selectedBook.key == book.key) {
			dispatch(setSelectedBook(null));
		} else {
			dispatch(setSelectedBook(book));
		}

    }

	const leftRef = useRef<HTMLButtonElement>(null);
	const rightRef = useRef<HTMLButtonElement>(null);

	return (
		<div className=" bg-white py-16 px-10 gap-4 text-black grid grid-cols-[auto_1fr_auto] items-center">
			<button
				ref={leftRef}
				className="flex justify-center items-center p-2 border border-solid border-black rounded-full"
			>
				<svg
					width="30"
					height="30"
					viewBox="0 0 30 26"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M13.1617 1.08745C13.3372 1.26323 13.4359 1.50151 13.4359 1.74995C13.4359 1.99838 13.3372 2.23667 13.1617 2.41245L3.51324 12.0624L28.7492 12.0624C28.9978 12.0624 29.2363 12.1612 29.4121 12.337C29.5879 12.5128 29.6867 12.7513 29.6867 12.9999C29.6867 13.2486 29.5879 13.487 29.4121 13.6629C29.2363 13.8387 28.9978 13.9374 28.7492 13.9374L3.51324 13.9374L13.1617 23.5874C13.3273 23.7652 13.4174 24.0002 13.4131 24.2431C13.4089 24.486 13.3105 24.7177 13.1387 24.8895C12.9669 25.0612 12.7352 25.1596 12.4923 25.1639C12.2495 25.1682 12.0144 25.078 11.8367 24.9124L0.586675 13.6624C0.411112 13.4867 0.3125 13.2484 0.3125 12.9999C0.3125 12.7515 0.411112 12.5132 0.586675 12.3374L11.8367 1.08745C12.0125 0.911882 12.2507 0.813271 12.4992 0.813271C12.7476 0.813271 12.9859 0.911882 13.1617 1.08745Z"
						fill="currentColor"
					/>
				</svg>
			</button>
            <div className="w-auto overflow-hidden">

                <Swiper
                    className="flex items-center"
                    modules={[Navigation]}
                    navigation={{
                        prevEl: leftRef.current,
                        nextEl: rightRef.current,
                    }}
                    spaceBetween={10}
                    breakpoints={{
						1280: {
                            slidesPerView: 6,
                            spaceBetween: 30,
						},
                        1025: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },

                        768: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                        },

                        640: {
                            slidesPerView: 3,
                            spaceBetween: 12,
                        },

                        480: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                    }}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onBeforeInit={(swip:any) => {
                        swip.params.navigation.prevEl = leftRef.current;
                        swip.params.navigation.nextEl = rightRef.current;
                    }}
                >
                    {books.map((book, index) => (
                        <SwiperSlide key={book.key}>
                            <div className={`flex flex-col justify-between gap-3 items-start cursor-pointer transition-all duration-500 ${selectedBook && selectedBook.key === book.key ? 'p-2 bg-black text-white':''}`} onClick={()=>handleBookClick(book)}>
                                <img
                                    className="rounded-lg h-80 object-fill"
                                    src={`images/books/${book.image}`}
                                    alt={book.title}
                                />
                                <span className="font-syne font-semibold text-xl leading-7">{book.title}</span>
                                <span className={`font-roboto-condensed font-normal text-base leading-[18px]  ${selectedBook && selectedBook.key === book.key ? 'pb-0.5 text-gray-300':''}`}>{book.author}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
			<button
				ref={rightRef}
				className="flex justify-center items-center p-2 border border-solid border-black rounded-full"
			>
				<svg
					width="30"
					height="30"
					viewBox="0 0 30 26"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					className=" transform rotate-180"
				>
					<path
						d="M13.1617 1.08745C13.3372 1.26323 13.4359 1.50151 13.4359 1.74995C13.4359 1.99838 13.3372 2.23667 13.1617 2.41245L3.51324 12.0624L28.7492 12.0624C28.9978 12.0624 29.2363 12.1612 29.4121 12.337C29.5879 12.5128 29.6867 12.7513 29.6867 12.9999C29.6867 13.2486 29.5879 13.487 29.4121 13.6629C29.2363 13.8387 28.9978 13.9374 28.7492 13.9374L3.51324 13.9374L13.1617 23.5874C13.3273 23.7652 13.4174 24.0002 13.4131 24.2431C13.4089 24.486 13.3105 24.7177 13.1387 24.8895C12.9669 25.0612 12.7352 25.1596 12.4923 25.1639C12.2495 25.1682 12.0144 25.078 11.8367 24.9124L0.586675 13.6624C0.411112 13.4867 0.3125 13.2484 0.3125 12.9999C0.3125 12.7515 0.411112 12.5132 0.586675 12.3374L11.8367 1.08745C12.0125 0.911882 12.2507 0.813271 12.4992 0.813271C12.7476 0.813271 12.9859 0.911882 13.1617 1.08745Z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	);
}
