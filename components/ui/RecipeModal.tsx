import React from "react";
import { X } from "lucide-react";
import { Recipe } from "@/types";

interface RecipeModalProps {
	recipe: Recipe | null;
	isOpen: boolean;
	onClose: () => void;
}

export function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
	if (!isOpen || !recipe) return null;

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

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50"
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Modal Header */}
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<img
							src={recipe.strMealThumb}
							alt={recipe.strMeal}
							className="w-8 h-8 rounded-md object-cover"
						/>
						{recipe.strMeal}
					</h2>
				</div>

				{/* Modal Body */}
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<img
								src={recipe.strMealThumb}
								alt={recipe.strMeal}
								className="w-full rounded-lg object-cover"
							/>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">
									Ingredients
								</h3>
								<ul className="space-y-1 text-sm">
									{getIngredients(recipe).map(
										(ingredient, index) => (
											<li
												key={index}
												className="flex items-center gap-2"
											>
												<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
												{ingredient}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h3 className="font-semibold mb-2">Instructions</h3>
						<div className="prose prose-sm max-w-none">
							<p className="text-sm leading-relaxed whitespace-pre-line">
								{recipe.strInstructions}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
