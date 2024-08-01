import React, { useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp, IoIosSearch } from "react-icons/io";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import Mint from "../mint";
import useSession from "@/hooks/useSession";
import MintedBook from "./components/MintedBook";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import fetchEngineBooks from "./thunks/fetchEngineBooks";
import { setExpanded } from "./engineBooksSlice";
import { ImSpinner8 } from "react-icons/im";

const TO_DISPLAY = 5;

const EngineBooks = () => {
    const {actor} = useSession();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.auth);
	const { activeEngine } = useAppSelector((state) => state.engineOverview);

	const { expanded, loading, error, books } = useAppSelector((state) => state.engineBooks);

    useEffect(() => {
		// fetch once or when a new book is uploaded
		if(books.length>0) return;
        dispatch(fetchEngineBooks({
			actor, engine: activeEngine
		}));
    }, []);

	return (
		<div className="bg-white rounded-lg">
			{/* <div className="flex justify-between items-center p-4 border-b border-solid border-black">
				<span className="font-roboto-condensed font-bold text-xl leading-6 text-black">
					Manage Books {"("+books.length+")"}
				</span>
				<span className="font-roboto-condensed text-base leading-[18px] text-gray-500">
					Clear All
				</span>
			</div> */}
			<div className="flex flex-col gap-2">
				{user == activeEngine && (
					<>
						<span className="font-roboto-condensed text-base leading-[18px] text-black font-normal">
							Add Book
						</span>
						<div className="flex justify-between items-center gap-4">
							<div className="flex-grow border border-solid border-gray-500 rounded-full flex items-center gap-2 px-4 py-2">
								<IoIosSearch />
								<input
									type="text"
									placeholder="Search"
									className="font-roboto-condensed font-normal text-base flex-grow rounded border-0 ring-0 focus:ring-0 outline-none"
								/>
							</div>
							<Mint />
						</div>
					</>
				)}
				<div className="flex gap-1 justify-start items-center font-roboto-condensed text-base leading-[18px] text-black font-normal">
					{loading &&	<span>Loading</span> }
					<span>Minted Books</span>
					{ loading && <ImSpinner8
						size={14}
						className="animate animate-spin"
					/>}
				</div>
				{error &&
					<div className="flex flex-col gap-2 justify-start items-start font-roboto-condensed text-base leading-[18px] text-black font-normal">
						<span>Error loading books</span>
						<span>{error}</span>
					</div>
				}
				<div
					className={`flex flex-col gap-2 ${
						expanded ? "h-auto" : "max-h-96 overflow-auto"
					}`}
				>
					{books.slice(0, expanded ? books.length : TO_DISPLAY).map(token => (
						<MintedBook key={token.token_id} token={token} />
					))}
				</div>
				{books.length > TO_DISPLAY && (
					<div
						className="cursor-pointer hover:text-gray-500 font-roboto-condensed text-sm font-medium flex justify-center items-center gap-2"
						onClick={() => dispatch(setExpanded(!expanded))}
					>
						{expanded ? (
							<span> View Less</span>
						) : (
							<span>View All </span>
						)}

						{expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
					</div>
				)}
			</div>
		</div>
	);
};

export default EngineBooks;
