import React from "react";
import Auth from "@/features/auth";
import Logo from "./ui/Logo";
import Tabs from "./ui/Tabs";

function Header() {

	return (
			<div className="flex-grow-0 flex-shrink-0 flex basis-24 justify-between items-center">
				<Logo />
				<Tabs />
				<Auth />
			</div>
	);
}

export default Header;