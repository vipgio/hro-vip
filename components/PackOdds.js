const PackOdds = ({ odds }) => {
	return (
		<div className='divide-y divide-gray-500 pt-1'>
			{odds
				.sort((a, b) => b.chance - a.chance)
				.map((odd) => (
					<div
						className='flex px-1 hover:bg-gray-300 dark:hover:bg-gray-500'
						key={odd.treatmentId}
					>
						{odd.name} ({odd.tier})<div className='ml-auto'>{odd.chance}%</div>
					</div>
				))}
		</div>
	);
};
export default PackOdds;
