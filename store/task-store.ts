import { create } from "zustand";
import { Task, TaskFormData, TaskFilters } from "@/types";

interface TaskStore {
	tasks: Task[];
	filters: TaskFilters;
	isLoading: boolean;

	// Actions
	addTask: (taskData: TaskFormData) => void;
	updateTask: (id: string, taskData: Partial<TaskFormData>) => void;
	deleteTask: (id: string) => void;
	setFilters: (filters: Partial<TaskFilters>) => void;
	getFilteredTasks: () => Task[];
	getUniqueAssignees: () => string[];

	// Initialize with sample data
	initializeSampleData: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useTaskStore = create<TaskStore>((set, get) => ({
	tasks: [],
	filters: {
		status: "All",
		priority: "All",
		sortBy: "createdAt",
		sortOrder: "desc",
		search: "",
		assignee: "",
	},
	isLoading: false,

	addTask: (taskData: TaskFormData) => {
		const newTask: Task = {
			id: generateId(),
			...taskData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		set((state) => ({
			tasks: [...state.tasks, newTask],
		}));
	},

	updateTask: (id: string, taskData: Partial<TaskFormData>) => {
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task.id === id
					? { ...task, ...taskData, updatedAt: new Date() }
					: task
			),
		}));
	},

	deleteTask: (id: string) => {
		set((state) => ({
			tasks: state.tasks.filter((task) => task.id !== id),
		}));
	},

	setFilters: (filters: Partial<TaskFilters>) => {
		set((state) => ({
			filters: { ...state.filters, ...filters },
		}));
	},

	getUniqueAssignees: () => {
		const { tasks } = get();
		const assignees = tasks
			.map((task) => task.assignee)
			.filter(
				(assignee): assignee is string =>
					assignee !== undefined && assignee.trim() !== ""
			)
			.filter(
				(assignee, index, array) => array.indexOf(assignee) === index
			)
			.sort();
		return ["All", ...assignees];
	},

	getFilteredTasks: () => {
		const { tasks, filters } = get();
		let filteredTasks = [...tasks];

		// Filter by search query (search in title only)
		if (filters.search && filters.search.trim() !== "") {
			const searchTerm = filters.search.toLowerCase().trim();
			filteredTasks = filteredTasks.filter((task) =>
				task.title.toLowerCase().includes(searchTerm)
			);
		}

		// Filter by assignee
		if (filters.assignee && filters.assignee !== "All") {
			filteredTasks = filteredTasks.filter(
				(task) => task.assignee === filters.assignee
			);
		}

		// Filter by status
		if (filters.status && filters.status !== "All") {
			filteredTasks = filteredTasks.filter(
				(task) => task.status === filters.status
			);
		}

		// Filter by priority
		if (filters.priority && filters.priority !== "All") {
			filteredTasks = filteredTasks.filter(
				(task) => task.priority === filters.priority
			);
		}

		// Sort tasks
		if (filters.sortBy) {
			filteredTasks.sort((a, b) => {
				let aValue: any = a[filters.sortBy!];
				let bValue: any = b[filters.sortBy!];

				if (filters.sortBy === "priority") {
					const priorityOrder = { Low: 1, Medium: 2, High: 3 };
					aValue = priorityOrder[a.priority];
					bValue = priorityOrder[b.priority];
				}

				if (filters.sortBy === "dueDate") {
					if (!aValue && !bValue) return 0;
					if (!aValue) return 1;
					if (!bValue) return -1;
					aValue = new Date(aValue).getTime();
					bValue = new Date(bValue).getTime();
				}

				if (filters.sortBy === "createdAt") {
					aValue = new Date(aValue).getTime();
					bValue = new Date(bValue).getTime();
				}

				if (filters.sortOrder === "desc") {
					return bValue - aValue;
				}
				return aValue - bValue;
			});
		}

		return filteredTasks;
	},

	initializeSampleData: () => {
		const sampleTasks: Task[] = [
			{
				id: "1",
				title: "Setup project structure",
				description:
					"Create the initial project structure with all necessary folders and files",
				status: "Done",
				priority: "High",
				dueDate: new Date("2024-01-15"),
				assignee: "John Doe",
				createdAt: new Date("2024-01-10"),
				updatedAt: new Date("2024-01-12"),
			},
			{
				id: "2",
				title: "Install Zustand and Zod ",
				description:
					"Handle the state management with Zustand and validation with Zod",
				status: "In Progress",
				priority: "Medium",
				dueDate: new Date("2024-01-20"),
				assignee: "Kaustubh Sule",
				createdAt: new Date("2024-01-11"),
				updatedAt: new Date("2024-01-14"),
			},
			{
				id: "3",
				title: "Implement authentication",
				description: "Add user login and registration functionality",
				status: "To Do",
				priority: "High",
				dueDate: new Date("2024-01-25"),
				assignee: "Bob Johnson",
				createdAt: new Date("2024-01-12"),
				updatedAt: new Date("2024-01-12"),
			},
			{
				id: "4",
				title: "Write documentation",
				description: "Create comprehensive documentation for the API",
				status: "To Do",
				priority: "Low",
				assignee: "Alice Brown",
				createdAt: new Date("2024-01-13"),
				updatedAt: new Date("2024-01-13"),
			},
			{
				id: "5",
				title: "Performance optimization",
				description:
					"Optimize database queries and improve page load times",
				status: "In Progress",
				priority: "Medium",
				dueDate: new Date("2024-01-30"),
				assignee: "Charlie Wilson",
				createdAt: new Date("2024-01-14"),
				updatedAt: new Date("2024-01-15"),
			},
			{
				id: "6",
				title: "Setup Next.js repo with Tailwind",
				description:
					"Use app router, lucide-react and tailwind v4",
				status: "Done",
				priority: "High",
				dueDate: new Date("2024-01-18"),
				assignee: "Kaustubh Sule",
				createdAt: new Date("2024-01-12"),
				updatedAt: new Date("2024-01-16"),
			},
			{
				id: "7",
				title: "Create a pull request for latest changes",
				description:
					"Push to staging branch and merge to main",
				status: "In Progress",
				priority: "Medium",
				dueDate: new Date("2024-01-22"),
				assignee: "Kaustubh Sule",
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-01-17"),
			},
			{
				id: "8",
				title: "Deploy to Vercel",
				description:
					"Connect the main branch to Vercel and deploy to custom DNS",
				status: "To Do",
				priority: "Low",
				dueDate: new Date("2024-02-05"),
				assignee: "Kaustubh Sule",
				createdAt: new Date("2024-01-16"),
				updatedAt: new Date("2024-01-16"),
			},
		];

		set({ tasks: sampleTasks });
	},
}));
