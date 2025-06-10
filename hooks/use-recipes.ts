import { useQuery } from "@tanstack/react-query";
import { RecipeResponse } from "@/types";

const fetchRecipes = async (search: string = ""): Promise<RecipeResponse> => {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	const url = `${baseUrl}/api/json/v1/1/search.php?s=${search}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch recipes");
	}

	return response.json();
};

export function useRecipes(search: string = "") {
	return useQuery({
		queryKey: ["recipes", search],
		queryFn: () => fetchRecipes(search),
		staleTime: 5 * 60 * 1000,
	});
}
