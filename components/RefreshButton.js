const RefreshButton = ({ loading, func, style, title }) => {
	return (
		<button
			title={title}
			className={`${style} my-outline flex flex-col items-center rounded-md bg-red-400 p-1 font-semibold text-gray-200 hover:bg-red-500 focus-visible:ring-offset-2 active:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
			disabled={loading}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className={`h-6 w-6 cursor-pointer ${loading && "animate-spin-ac"}`}
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
				strokeWidth={2}
				onClick={func}
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
				/>
			</svg>
		</button>
	);
};
export default RefreshButton;
