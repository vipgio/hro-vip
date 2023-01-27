const CircList = ({ data }) => {
	const opened = data.reduce((cur, acc) => cur + acc.inCirculation, 0);
	const burned = data.reduce((cur, acc) => cur + acc.burned, 0);
	return (
		<div className='flex justify-center px-2'>
			<div className='grid divide-y divide-green-400 rounded border border-green-400'>
				<div className='p-1 text-center text-lg font-semibold text-gray-700 dark:text-gray-200'>
					<div>Total Circulation: {opened}</div>
					<div>Burned: {burned}</div>
					<div>
						Unopened:{" "}
						{data.reduce((cur, acc) => cur + acc.mintCount, 0) - opened - burned}
					</div>
				</div>
				<div className='max-h-96 overflow-auto'>
					<table className='relative w-full table-auto'>
						<thead className='sticky top-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
							<tr>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Burned</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Edition of</th>
							</tr>
						</thead>
						<tbody className='h-96'>
							{data
								.sort((a, b) => a.inCirculation - b.inCirculation)
								.map((item) => (
									<tr
										className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
										key={item.uuid}
									>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.burned}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.mintCount}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default CircList;
