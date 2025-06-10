"use client";

import { format } from "date-fns";
import { Calendar, User, Trash2, Edit, ChevronDown } from "lucide-react";
import { Task } from "@/types";
import { useState, useRef, useEffect } from "react";

interface TaskCardProps {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => void;
	onStatusChange: (taskId: string, newStatus: string) => void;
}

const priorityColors = {
	Low: "bg-green-100 text-green-800 border-green-200",
	Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
	High: "bg-red-100 text-red-800 border-red-200",
};

const statusColors = {
	"To Do": "bg-gray-100 text-gray-800 border-gray-200",
	"In Progress": "bg-blue-100 text-blue-800 border-blue-200",
	Done: "bg-green-100 text-green-800 border-green-200",
};

const statusOptions = ["To Do", "In Progress", "Done"] as const;

export function TaskCard({
	task,
	onEdit,
	onDelete,
	onStatusChange,
}: TaskCardProps) {
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsStatusDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="space-y-2">
			<div className="cursor-pointer border rounded-md hover:shadow-md transition-shadow bg-white p-4">
				<div className="pb-3">
					<div className="flex items-start justify-between">
						<h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">
							{task.title}
						</h3>
						<div className="flex gap-x-1">
							<div
								className="h-6 center rounded-md hover:bg-gray-100 w-6 opacity-70 hover:opacity-100"
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									onEdit(task);
								}}
							>
								<Edit className="h-4 w-4" />
							</div>
							<div
								className="h-6 center rounded-md hover:bg-gray-100 w-6 opacity-70 hover:opacity-100"
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									onDelete(task.id);
								}}
							>
								<Trash2 className="h-4 w-4" />
							</div>
						</div>
					</div>

					{task.description && (
						<p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 mt-2">
							{task.description}
						</p>
					)}
				</div>

				{/* priority and status */}
				<div className="">
					<div className="flex flex-wrap gap-2">
						<div
							className={`text-xs rounded-full font-semibold px-3 py-1 ${
								priorityColors[task.priority]
							}`}
						>
							{task.priority}
						</div>

						{/* Interactive Status Badge */}
						<div
							className="relative"
							ref={dropdownRef}
						>
							<div
								className={`text-xs rounded-full font-semibold px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${
									statusColors[task.status]
								}`}
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									setIsStatusDropdownOpen(
										!isStatusDropdownOpen
									);
								}}
							>
								{task.status}
								<ChevronDown className="h-3 w-3" />
							</div>

							{isStatusDropdownOpen && (
								<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
									{statusOptions.map((status) => (
										<div
											key={status}
											className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
												task.status === status
													? "bg-gray-100 font-medium"
													: ""
											}`}
											onClick={(e: React.MouseEvent) => {
												e.stopPropagation();
												onStatusChange(task.id, status);
												setIsStatusDropdownOpen(false);
											}}
										>
											{status}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* due date and assignee */}
				<div className=" mt-4 text-gray-500">
					<div className="w-full space-y-2">
						{task.dueDate && (
							<div className="flex items-center gap-1 text-xs ">
								<Calendar className="h-3 w-3" />
								<span>
									Due{" "}
									{format(new Date(task.dueDate), "MMM dd")}
								</span>
							</div>
						)}

						{task.assignee && (
							<div className="flex items-center gap-1 text-xs ">
								<User className="h-3 w-3" />
								<span>{task.assignee}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
