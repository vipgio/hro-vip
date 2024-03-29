import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import HistoryModal from "components/HistoryModal";

const FullListRow = React.memo(({ item, isSelfScan }) => {
	const [showHistory, setShowHistory] = useState(false);

	const openModal = (e) => {
		e.stopPropagation();
		setShowHistory(true);
	};

	return (
		<tr
			className='border-b border-gray-200 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
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
		</tr>
	);
});
FullListRow.displayName = "FullListRow";
export default FullListRow;
