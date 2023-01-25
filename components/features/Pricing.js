const Pricing = ({ features }) => {
	return (
		<>
			<div className='mt-8 flex flex-col justify-center px-2'>
				<h1 className='mb-2 text-center text-4xl font-semibold text-gray-800 dark:text-gray-200'>
					Pricing
				</h1>
				<table className='mt-5 w-full table-auto border border-gray-600 text-gray-700 transition-colors dark:border-gray-400 dark:text-gray-300'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Feature</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>1 Month</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>2 Months</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{features
							.filter((feature) => feature.price && !feature.info.perUse)
							.map((feature) => (
								<tr
									className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={feature.id}
								>
									<td className='w-1/3 py-1 px-2 sm:py-3 sm:px-6'>{feature.info.name}</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>${feature.price}</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>${feature.price2}</td>
								</tr>
							))}
					</tbody>
				</table>

				<h2 className='mt-5 p-1 text-xl font-semibold text-gray-700 dark:text-gray-300'>
					Other services
				</h2>
				<table className='mb-4 w-full table-auto border border-gray-600 text-gray-700 transition-colors dark:border-gray-400 dark:text-gray-300'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Feature</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Per Use</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{features
							.filter((feature) => feature.info.perUse)
							.map((feature) => (
								<tr
									className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={feature.id}
								>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>{feature.info.name}</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>${feature.price}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default Pricing;
