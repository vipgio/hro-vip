const LoadingSpin = ({ size }) => {
	return (
		<div
			className={`${
				size === 4 ? "h-4 w-4" : "h-7 w-7"
			} animate-spin rounded-full border-4 border-gray-200 border-t-gray-700`}
		></div>
	);
};
export default LoadingSpin;
