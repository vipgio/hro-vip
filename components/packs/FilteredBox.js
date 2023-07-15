import { useState } from "react";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import PackModal from "./PackModal";

const FilteredBox = ({ pack }) => {
	const [showModal, setShowModal] = useState(false);

	const openModal = (e) => {
		e.stopPropagation();
		setShowModal(true);
	};

	return (
		<>
			<div className='flex rounded border border-gray-500 pr-1'>
				<div className='m-1 flex h-24 w-1/3 items-center justify-center'>
					<ImageWrapper
						src={`${CDN}${pack.images.find((img) => img.name === "image").url}`}
						width={50}
						height={75}
						alt={pack.name}
					/>
				</div>
				<div className='m-1 w-2/3 text-gray-700 dark:text-gray-300'>
					<div
						className='cursor-pointer text-lg font-semibold hover:underline'
						onClick={openModal}
					>
						{pack.name}
					</div>
					<div>Season: {pack.properties.seasons[0]}</div>
					<div> Cost: {Number(pack.cost).toLocaleString()} </div>
				</div>
				{showModal ? (
					<PackModal pack={pack} isOpen={showModal} setIsOpen={setShowModal} />
				) : null}
			</div>
		</>
	);
};
export default FilteredBox;
