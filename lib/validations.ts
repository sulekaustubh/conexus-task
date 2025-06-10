import { z } from "zod";

export const taskSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters"),
	description: z.string().optional(),
	status: z.enum(["To Do", "In Progress", "Done"]),
	priority: z.enum(["Low", "Medium", "High"]),
	dueDate: z.date().optional(),
	assignee: z.string().optional(),
});

export const taskFiltersSchema = z.object({
	status: z.enum(["To Do", "In Progress", "Done", "All"]).optional(),
	priority: z.enum(["Low", "Medium", "High", "All"]).optional(),
	sortBy: z.enum(["dueDate", "priority", "createdAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	search: z.string().optional(),
	assignee: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type TaskFiltersValues = z.infer<typeof taskFiltersSchema>;
