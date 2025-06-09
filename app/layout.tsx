import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Collaborative Task Manager",
	description:
		"A modern task management application with Kanban board and recipe viewer",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<div className="min-h-screen bg-background">
						<Navigation />
						<main className="container mx-auto px-4 py-8">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
