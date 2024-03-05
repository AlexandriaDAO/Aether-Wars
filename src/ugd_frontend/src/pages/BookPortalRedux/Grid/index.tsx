import React from "react";
import Card from "./Card";

const Grid = ({books=[]}:{books:any[]}) => {
	return (
        <div className="transition duration-300">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
                {books.map((book: any, index: number) => (
                    <Card item={book} key={index} />
                ))}
            </div>
        </div>
	);
};

export default Grid;
