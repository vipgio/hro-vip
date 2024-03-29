import { useState } from "react";
import { FaLock, FaBan, FaHistory } from "react-icons/fa";
import HistoryModal from "../HistoryModal";

const MintResultRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);

	const openModal = () => {
		setShowHistory(true);
	};
	return (
		<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='flex items-center justify-center'>
					{item.mintBatch}
					{item.mintNumber}
				</div>
			</td>

			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.delta > 0 ? `+${item.delta}` : 0}
			</td>

			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					target='_blank'
					href={`https://app.hro.gg/DC/users/${item.owner.username}`}
					rel='noopener noreferrer'
					className='hover:text-main-500 hover:underline hover:underline-offset-2'
				>
					{item.owner.username}
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
		</tr>
	);
};
export default MintResultRow;
