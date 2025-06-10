"use client";

import { useState } from "react";
import { Search, Loader2, ChefHat } from "lucide-react";
import { useRecipes } from "@/hooks/use-recipes";
import { Recipe } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SimpleTable from "@/components/ui/SimpleTable";
import { RecipeModal } from "@/components/ui/RecipeModal";

export function RecipeTable() {
	const [search, setSearch] = useState("");
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const { data, isLoading, error } = useRecipes(search);

	const getIngredients = (recipe: Recipe): string[] => {
		const ingredients: string[] = [];
		for (let i = 1; i <= 20; i++) {
			const ingredient = recipe[
				`strIngredient${i}` as keyof Recipe
			] as string;
			const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;

			if (ingredient && ingredient.trim()) {
				ingredients.push(
					`${measure ? measure.trim() + " " : ""}${ingredient.trim()}`
				);
			}
		}
		return ingredients;
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// The search is automatically handled by the query when search state changes
	};

	return (
		<div className="space-y-6">
			{/* header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<ChefHat className="h-8 w-8" />
						Recipe Browser
					</h1>
					<p className="text-muted-foreground">
						Search and explore delicious recipes from around the
						world
					</p>
				</div>
			</div>

			{/* search */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6">
				<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Search className="h-4 w-4" />
					Search Recipes
				</h2>
				<form
					onSubmit={handleSearch}
					className="flex gap-2"
				>
					<Input
						placeholder="Search for recipes (e.g., chicken, pasta, beef)..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="flex-1"
					/>
					<Button
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Search className="h-4 w-4" />
						)}
					</Button>
				</form>
			</div>

			{/* Results */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold">
						{data?.meals
							? `${data.meals.length} Recipes Found`
							: "Recipes"}
					</h2>
				</div>
				<div className="p-6">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin" />
							<span className="ml-2">Loading recipes...</span>
						</div>
					) : error ? (
						<div className="text-center py-8 text-destructive">
							<p>Error loading recipes. Please try again.</p>
						</div>
					) : !data?.meals ? (
						<div className="text-center py-8 text-muted-foreground">
							<ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>
								No recipes found. Try searching for a different
								ingredient.
							</p>
						</div>
					) : (
						<SimpleTable
							columns={[
								{
									header: "Recipe",
									key: "recipe",
									render: (recipe: Recipe) => (
										<div className="flex items-center gap-3">
											<img
												src={recipe.strMealThumb}
												alt={recipe.strMeal}
												className="w-12 h-12 rounded-md object-cover"
											/>
											<div>
												<p className="font-medium">
													{recipe.strMeal}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Ingredients",
									key: "ingredients",
									render: (recipe: Recipe) => {
										const ingredients =
											getIngredients(recipe);
										return (
											<div className="max-w-md">
												<p className="text-sm text-muted-foreground line-clamp-2">
													{ingredients
														.slice(0, 3)
														.join(", ")}
													{ingredients.length > 3 &&
														` +${
															ingredients.length -
															3
														} more`}
												</p>
											</div>
										);
									},
								},
								{
									header: "Actions",
									key: "actions",
									render: (recipe: Recipe) => (
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setSelectedRecipe(recipe)
											}
										>
											View Details
										</Button>
									),
								},
							]}
							data={data.meals}
						/>
					)}
				</div>
			</div>

			{/* Recipe Detail Modal */}
			<RecipeModal
				recipe={selectedRecipe}
				isOpen={!!selectedRecipe}
				onClose={() => setSelectedRecipe(null)}
			/>
		</div>
	);
}
