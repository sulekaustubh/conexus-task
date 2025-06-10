"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Tasks", href: "/", icon: Kanban },
	{ name: "Recipes", href: "/recipes", icon: ChefHat },
];

export function Navigation() {
	const pathname = usePathname();

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-8">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl"
						>
							<Kanban className="h-6 w-6" />
							TaskManager
						</Link>

						<nav className="flex items-center gap-6">
							{navigation.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
											isActive
												? "text-primary border-b-2 border-primary pb-4"
												: "text-muted-foreground"
										)}
									>
										<Icon className="h-4 w-4" />
										{item.name}
									</Link>
								);
							})}
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
