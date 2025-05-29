export const Button = ({
	children,
	onClick,
	disabled,
	loading,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
	loading?: boolean;
}) => (
	<button
		onClick={onClick}
		disabled={disabled || loading}
		className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center min-w-40 ${
			disabled
				? "bg-gray-700 text-gray-500 cursor-not-allowed"
				: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
		}`}
	>
		{loading ? (
			<>
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Processing...
			</>
		) : (
			children
		)}
	</button>
);
