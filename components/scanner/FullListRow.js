import React, { useContext, useState } from "react";
import { FaLock, FaBan, FaHistory } from "react-icons/fa";
import { useTrade } from "hooks/useTrade";
import { UserContext } from "context/UserContext";
import HistoryModal from "components/HistoryModal";

const FullListRow = React.memo(({ item, owner, isSelfScan, ownedItems }) => {
	const { user, tradeList } = useContext(UserContext);
	const [showHistory, setShowHistory] = useState(false);
	const { handleItem } = useTrade();

	const openModal = (e) => {
		e.stopPropagation();
		setShowHistory(true);
	};

	const onChange = () => {
		handleItem(isSelfScan, item, owner, ownedItems);
	};

	return (
		<tr
			className={`border-b border-gray-200 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 ${
				user.info.allowed.includes("trades")
					? isSelfScan
						? tradeList.send &&
						  tradeList.send[0] &&
						  tradeList.send[0].items.some((sentItem) => sentItem.id === item.id)
							? "bg-gray-300 dark:bg-gray-600"
							: "bg-gray-100 dark:bg-gray-800"
						: tradeList.receive?.some((user) =>
								user.items?.some((listItem) => listItem.id === item.id)
						  )
						? "bg-gray-300 dark:bg-gray-600"
						: "bg-gray-100 dark:bg-gray-800"
					: "bg-gray-100 dark:bg-gray-800"
			}`}
			key={item.id}
		>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<span className='flex items-center justify-center'>
					{item.mintBatch}
					{item.mintNumber}
				</span>
			</td>
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.status === "market" ? "Yes" : "No"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{(item.rating * 10).toFixed(2)}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
			{!isSelfScan && (
				<td className='py-1 px-2 sm:py-3 sm:px-6'>
					{item.delta > 0 ? `+${item.delta}` : 0}
				</td>
			)}
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<span className='relative flex h-8 items-center justify-center'>
					{showHistory ? (
						<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} />
					) : (
						<button onClick={openModal}>
							<FaHistory />
						</button>
					)}
				</span>
			</td>
			<td>
				<span className='inline-flex justify-center'>
					{user.info.allowed.includes("trades") && (
						<input
							type='checkbox'
							name='trade'
							id='trade'
							checked={
								user.info.allowed.includes("trades")
									? isSelfScan
										? tradeList.send &&
										  tradeList.send[0] &&
										  tradeList.send[0].items.some((sentItem) => sentItem.id === item.id)
										: tradeList.receive?.some((user) =>
												user.items?.some((listItem) => listItem.id === item.id)
										  )
									: false
							}
							disabled={item.status !== "available"}
							onChange={onChange}
							title={
								item.status === "market"
									? "Item is listed on the market"
									: item.status !== "available"
									? "Item is not available"
									: "Add to trade list"
							}
							className='cursor-pointer disabled:cursor-not-allowed'
						/>
					)}
				</span>
			</td>
		</tr>
	);
});
FullListRow.displayName = "FullListRow";
export default FullListRow;
