import { useState } from "react";
import { toast } from "react-toastify";
import { FaLock, FaBan, FaHistory } from "react-icons/fa";
import { useAxios } from "hooks/useAxios";
import HistoryModal from "../HistoryModal";
import LoadingSpin from "../LoadingSpin";
import "react-toastify/dist/ReactToastify.css";

const MarketResultRow = ({ item }) => {
	const [showHistory, setShowHistory] = useState(false);
	const [loading, setLoading] = useState(false);
	const { postData } = useAxios();

	const buyItem = async () => {
		setLoading(true);
		const { error, info } = await postData("/api/market/buy", {
			id: item.marketId,
			price: item.price,
		});

		if (info?.success) {
			toast.success(
				`Purchased ${item[item.type].mintBatch}${item[item.type].mintNumber} ${
					item.title
				} for ${item.price}!\n`,
				{ toastId: item.marketId, autoClose: 3000, position: "top-left" }
			);
		} else {
			toast.error(error.response.data.error, {
				toastId: item.marketId,
				autoClose: 3000,
				position: "top-left",
			});
		}
		setLoading(false);
	};

	const openModal = () => {
		setShowHistory(true);
	};

	return (
		<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='flex items-center justify-center'>
					{item.card.mintBatch}
					{item.card.mintNumber}
				</div>
			</td>
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>${item.price}</td>
			<td className='hidden h-full min-w-[10rem] items-end py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
				{item.minOffer ? `$${item.minOffer}` : "-"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.delta > 0 ? `+${item.delta}` : 0}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					target='_blank'
					href={`https://app.hro.gg/DC/users/${item.user.username}`}
					rel='noopener noreferrer'
					className='underline hover:text-main-500'
				>
					{item.user.username}
				</a>
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					href={`https://app.hro.gg/DC/marketplace/${item.type}/${item.card.cardTemplateId}/${item.marketId}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-main-500 underline'
				>
					Click
				</a>
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='relative flex h-8 items-center justify-center'>
					{showHistory ? (
						<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} />
					) : (
						<button onClick={openModal}>
							<FaHistory />
						</button>
					)}
				</div>
			</td>
			<td>
				<button onClick={buyItem} title='Quick buy' className='simple-button p-0.5'>
					{loading ? <LoadingSpin size={4} /> : "Buy"}
				</button>
			</td>
		</tr>
	);
};
export default MarketResultRow;
