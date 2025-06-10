"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTaskStore } from "@/store/task-store";

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const initializeSampleData = useTaskStore(
		(state) => state.initializeSampleData
	);

	useEffect(() => {
		// Initialize sample data on first load
		initializeSampleData();
	}, [initializeSampleData]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
