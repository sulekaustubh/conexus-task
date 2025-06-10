import React from "react";

interface HeaderProps {
	title: string;
	subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
	return (
		<div>
			<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
				{title}
			</h1>
			<p className="text-sm md:text-base lg:text-lg text-gray-500">
				{subtitle}
			</p>
		</div>
	);
}

export default Header;
