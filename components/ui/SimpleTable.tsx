import React from "react";

interface Column<T> {
	header: string;
	key: string;
	render?: (item: T, index: number) => React.ReactNode;
}

interface SimpleTableProps<T> {
	columns: Column<T>[];
	data: T[];
	onRowAction?: (item: T, index: number) => void;
}

const SimpleTable = <T,>({
	columns,
	data,
	onRowAction,
}: SimpleTableProps<T>) => {
	if (!data || data.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No data available
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-xs sm:text-base md:text-lg">
				<thead>
					<tr className="border-b">
						{columns.map((column, index) => (
							<th
								key={index}
								className="h-12 px-2 text-left  align-middle font-medium text-gray-600"
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
						>
							{columns.map((column, colIndex) => (
								<td
									key={colIndex}
									className="p-2 align-middle"
								>
									{column.render
										? column.render(row, rowIndex)
										: (row as any)[column.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SimpleTable;
