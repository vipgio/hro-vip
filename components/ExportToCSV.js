import { CSVLink } from "react-csv";
const ExportToCSV = ({ data, filename, type }) => {
	const headers = {
		mint: ["Mint", "Title", "Owner", "ID", "Points", "Point gain"],
		market: [
			"Mint",
			"Title",
			"Seller",
			"ID",
			"Type",
			"Points",
			"Point gain",
			"Min Offer",
			"Price",
			"Link",
		],
		full: [
			"Mint",
			"Title",
			"Circulation",
			"Listed",
			"Immutable",
			"ID",
			"Points",
			"Point Gain",
		],
		compact: ["Best Mint", "Title", "Owned", "Circulation"],
	};

	const array =
		type === "mint"
			? data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.owner.username,
					item.id,
					(item.rating * 10).toFixed(2),
					item.delta,
			  ])
			: type === "market"
			? data.map((item) => [
					`${item[item.type].mintBatch}${item[item.type].mintNumber}`,
					item.title,
					item.user.username,
					item.card.id,
					item.type,
					(item[item.type].rating * 10).toFixed(2),
					item.delta,
					item.minOffer ? item.minOffer : "-",
					item.price,
					`https://app.hro.gg/DC/marketplace/${item.type}/${item.card.cardTemplateId}/${item.marketId}`,
			  ])
			: type === "compact"
			? data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.owned,
					item.inCirculation,
			  ])
			: data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.inCirculation,
					item.status === "market" ? "Yes" : "No",
					item.status === "imx_locked" ? "Yes" : "No",
					item.id,
					(item.rating * 10).toFixed(2),
					Math.max(item.delta, 0),
			  ]);

	const csvData = [headers[type], ...array];
	return (
		<div>
			<button className='inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent border-gray-200 bg-gray-800 text-center font-medium text-main-500 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:shadow-lg enabled:hover:bg-gray-700 enabled:hover:text-main-600 enabled:active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:enabled:hover:bg-gray-300 dark:enabled:active:bg-gray-400'>
				<CSVLink
					data={csvData}
					filename={filename}
					className='px-3 py-2 focus:outline-none'
					tabIndex={-1}
				>
					Export
				</CSVLink>
			</button>
		</div>
	);
};
export default ExportToCSV;
