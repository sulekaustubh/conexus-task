"use client";

import { useState } from "react";
import { Plus, Filter, SortAsc, Search } from "lucide-react";
import { Task } from "@/types";
import { useTaskStore } from "@/store/task-store";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DeleteModal } from "@/components/ui/delete-modal";

const statusColumns = [
	{ key: "To Do", title: "To Do", color: "border-gray-200" },
	{ key: "In Progress", title: "In Progress ⚡️", color: "border-blue-200" },
	{ key: "Done", title: "Done", color: "border-green-200" },
] as const;

export function TaskBoard() {
	const {
		tasks,
		filters,
		addTask,
		updateTask,
		deleteTask,
		setFilters,
		getFilteredTasks,
		getUniqueAssignees,
	} = useTaskStore();

	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

	const filteredTasks = getFilteredTasks();
	const uniqueAssignees = getUniqueAssignees();

	const getTasksByStatus = (status: string) => {
		return filteredTasks.filter((task) => task.status === status);
	};

	const handleCreateTask = (taskData: any) => {
		addTask(taskData);
	};

	const handleUpdateTask = (taskData: any) => {
		if (editingTask) {
			updateTask(editingTask.id, taskData);
			setEditingTask(null);
		}
	};

	const handleDeleteTask = () => {
		if (deletingTaskId) {
			deleteTask(deletingTaskId);
			setDeletingTaskId(null);
		}
	};

	const handleStatusChange = (taskId: string, newStatus: string) => {
		updateTask(taskId, { status: newStatus as any });
	};

	const handleSearchChange = (value: string) => {
		setFilters({ search: value });
	};

	const handleAssigneeChange = (value: string) => {
		setFilters({ assignee: value === "All" ? undefined : value });
	};

	return (
		<div className="">
			{/* header - iska component banana hai baad mei */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold">Task Board</h1>
					<p className="text-muted-foreground">
						Manage your tasks with this Kanban-style board
					</p>
				</div>

				<Button
					onClick={() => setIsCreateFormOpen(true)}
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Task
				</Button>
			</div>

			{/* filters */}
			<div className="flex my-12 items-center justify-between">
				{/* div for search and assignee */}
				<div className="flex items-end gap-4">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium invisible">
							Search Tasks
						</label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by title.."
								value={filters.search || ""}
								onChange={(e) =>
									handleSearchChange(e.target.value)
								}
								className="pl-10 w-64"
							/>
						</div>
						{filters.search && filters.search.trim() !== "" && (
							<p className="text-xs text-muted-foreground">
								{filteredTasks.length} task
								{filteredTasks.length !== 1 ? "s" : ""} found
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium">Assignee</label>
						<Select
							value={filters.assignee || "All"}
							onValueChange={handleAssigneeChange}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{uniqueAssignees.map((assignee) => (
									<SelectItem
										key={assignee}
										value={assignee}
									>
										{assignee}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* other filters */}
				<div>
					<div className="flex flex-wrap gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Priority
							</label>
							<Select
								value={filters.priority || "All"}
								onValueChange={(value) =>
									setFilters({
										priority:
											value === "All"
												? undefined
												: (value as any),
									})
								}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All</SelectItem>
									<SelectItem value="Low">Low</SelectItem>
									<SelectItem value="Medium">
										Medium
									</SelectItem>
									<SelectItem value="High">High</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Sort By
							</label>
							<Select
								value={filters.sortBy || "createdAt"}
								onValueChange={(value) =>
									setFilters({ sortBy: value as any })
								}
							>
								<SelectTrigger className="w-36">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="createdAt">
										Created Date
									</SelectItem>
									<SelectItem value="dueDate">
										Due Date
									</SelectItem>
									<SelectItem value="priority">
										Priority
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Order</label>
							<Select
								value={filters.sortOrder || "desc"}
								onValueChange={(value) =>
									setFilters({ sortOrder: value as any })
								}
							>
								<SelectTrigger className="w-24">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="asc">Asc</SelectItem>
									<SelectItem value="desc">Desc</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</div>

			{/* main board UI */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{statusColumns.map((column) => {
					const columnTasks = getTasksByStatus(column.key);

					return (
						<div
							key={column.key}
							className={`${column.color} border p-2 rounded-md border-t-4`}
						>
							<div className="flex items-center mx-4 my-2 justify-between">
								<span className="text-xl font-semibold">
									{column.title}
								</span>
								<span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
									{columnTasks.length}
								</span>
							</div>

							<div className="space-y-3 p-4">
								{columnTasks.map((task) => (
									<TaskCard
										key={task.id}
										task={task}
										onEdit={setEditingTask}
										onDelete={setDeletingTaskId}
										onStatusChange={handleStatusChange}
									/>
								))}

								{columnTasks.length === 0 && (
									<div className="text-center py-8 text-gray-700">
										<p>No tasks in this column</p>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* create task */}
			<TaskForm
				open={isCreateFormOpen}
				onOpenChange={setIsCreateFormOpen}
				onSubmit={handleCreateTask}
			/>

			{/* edit task */}
			<TaskForm
				task={editingTask || undefined}
				open={!!editingTask}
				onOpenChange={(open) => !open && setEditingTask(null)}
				onSubmit={handleUpdateTask}
			/>

			<DeleteModal
				isOpen={!!deletingTaskId}
				onClose={() => setDeletingTaskId(null)}
				onConfirm={handleDeleteTask}
			/>
		</div>
	);
}
