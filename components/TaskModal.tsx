"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Task, TaskFormData } from "@/types";
import { taskSchema, TaskFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface TaskFormProps {
	task?: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: TaskFormData) => void;
}

export function TaskForm({
	task,
	open,
	onOpenChange,
	onSubmit,
}: TaskFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TaskFormValues>({
		resolver: zodResolver(taskSchema),
		defaultValues: task
			? {
					title: task.title,
					description: task.description || "",
					status: task.status,
					priority: task.priority,
					assignee: task.assignee || "",
					dueDate: task.dueDate,
			  }
			: {
					title: "",
					description: "",
					status: "To Do",
					priority: "Medium",
					assignee: "",
			  },
	});

	const watchedStatus = watch("status");
	const watchedPriority = watch("priority");
	const watchedDueDate = watch("dueDate");

	// Reset form with task data when task changes or modal opens
	useEffect(() => {
		if (open && task) {
			reset({
				title: task.title,
				description: task.description || "",
				status: task.status,
				priority: task.priority,
				assignee: task.assignee || "",
				dueDate: task.dueDate,
			});
		} else if (open && !task) {
			reset({
				title: "",
				description: "",
				status: "To Do",
				priority: "Medium",
				assignee: "",
				dueDate: undefined,
			});
		}
	}, [open, task, reset]);

	const handleFormSubmit = async (data: TaskFormValues) => {
		await onSubmit(data);
		reset();
		onOpenChange(false);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			reset();
		}
		onOpenChange(newOpen);
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleOpenChange(false);
		}
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
				{/* Close button */}
				<button
					onClick={() => handleOpenChange(false)}
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>

				{/* Header */}
				<div className="flex flex-col space-y-1.5 text-left p-6 pb-4">
					<h2 className="text-lg font-semibold leading-none tracking-tight pr-8">
						{task ? "Edit Task" : "Create New Task"}
					</h2>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="space-y-4 p-6 pt-0"
				>
					<div className="space-y-2">
						<label
							htmlFor="title"
							className="text-sm font-medium leading-none"
						>
							Title *
						</label>
						<Input
							id="title"
							{...register("title")}
							placeholder="Enter task title"
						/>
						{errors.title && (
							<p className="text-sm text-destructive">
								{errors.title.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="description"
							className="text-sm font-medium leading-none"
						>
							Description
						</label>
						<Textarea
							id="description"
							{...register("description")}
							placeholder="Enter task description (optional)"
							rows={3}
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium leading-none">
								Status
							</label>
							<Select
								value={watchedStatus}
								onValueChange={(value) =>
									setValue("status", value as any)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="To Do">To Do</SelectItem>
									<SelectItem value="In Progress">
										In Progress
									</SelectItem>
									<SelectItem value="Done">Done</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium leading-none">
								Priority
							</label>
							<Select
								value={watchedPriority}
								onValueChange={(value) =>
									setValue("priority", value as any)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Low">Low</SelectItem>
									<SelectItem value="Medium">
										Medium
									</SelectItem>
									<SelectItem value="High">High</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="assignee"
							className="text-sm font-medium leading-none"
						>
							Assignee
						</label>
						<Input
							id="assignee"
							{...register("assignee")}
							placeholder="Enter assignee name (optional)"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium leading-none">
							Due Date
						</label>
						<div className="relative">
							<Input
								type="date"
								value={
									watchedDueDate
										? format(
												new Date(watchedDueDate),
												"yyyy-MM-dd"
										  )
										: ""
								}
								onChange={(e) => {
									const date = e.target.value
										? new Date(e.target.value)
										: undefined;
									setValue("dueDate", date);
								}}
								className="pr-10"
							/>
							<CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						</div>
					</div>

					{/* Footer */}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Saving..."
								: task
								? "Update Task"
								: "Create Task"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
