import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import AdvancedModal from "./AdvancedModal";
import SimpleModal from "./SimpleModal";
import Tooltip from "../Tooltip";
import FiltersModal from "./FiltersModal";

const CardGallery = ({ templates, user }) => {
	const [selectedTemplates, setSelectedTemplates] = useState([]);
	const [showAdvancedModal, setShowAdvancedModal] = useState(false);
	const [showSimpleModal, setShowSimpleModal] = useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	const [sortMethod, setSortMethod] = useState("listed");
	const defaultFilters = { minOwned: 1, minFloor: 0.1, maxFloor: 20000 };
	const [filters, setFilters] = useState(defaultFilters);

	useEffect(() => {
		setSelectedTemplates((prev) =>
			prev
				.filter((item) => item.count)
				.filter(
					(item) =>
						item.count >= filters.minOwned &&
						!(item.floor > filters.maxFloor) &&
						!(item.floor < filters.minFloor)
				)
		);
	}, [filters.minFloor, filters.maxFloor, filters.minOwned]);

	return (
		<>
			<div className='m-2'>
				<label htmlFor='sort' className='text-gray-800 dark:text-gray-200'>
					Sort By:
				</label>
				<select
					name='sort'
					id='sort'
					className='mx-2 my-1 rounded-md border border-gray-800 p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-main-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
					onChange={(e) => setSortMethod(e.target.value)}
					value={sortMethod}
				>
					<option value='listed'>Listed</option>
					<option value='owned'>Owned</option>
					<option value='floor'>Floor</option>
				</select>
			</div>

			<div className='ml-1 flex h-full'>
				<div className='flex items-end'>
					<button
						onClick={() =>
							setSelectedTemplates(
								templates
									.filter((item) => item.count)
									.filter(
										(item) =>
											item.count >= filters.minOwned &&
											!(item.floor > filters.maxFloor) &&
											!(item.floor < filters.minFloor)
									)
							)
						}
						className='simple-button m-1'
					>
						Select All
					</button>
					<button onClick={() => setSelectedTemplates([])} className='simple-button m-1'>
						Deselect All
					</button>
					<button onClick={() => setShowFiltersModal(true)} className='simple-button m-1'>
						Filters
					</button>
				</div>
				<div className='ml-auto flex flex-col justify-end py-1 sm:block'>
					<div className='mb-2 flex items-center'>
						<Tooltip direction='left' text='Pick mints and price for each item' />
						<button
							className='button mr-2 sm:mb-0'
							onClick={() => {
								setShowAdvancedModal(true);
							}}
							disabled={!selectedTemplates.length}
						>
							Advanced
						</button>
					</div>
					<div className='mt-1 flex items-center sm:mt-2'>
						<Tooltip
							direction='left'
							text='Pick mints or set count for all items at once'
						/>
						<button
							className='button mr-2 w-full sm:mb-0'
							onClick={() => {
								setShowSimpleModal(true);
							}}
							disabled={!selectedTemplates.length}
						>
							Simple
						</button>
					</div>
				</div>
			</div>

			<div className='m-2 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5'>
				{sortBy(
					templates,
					sortMethod === "owned"
						? [(o) => -o.count, (o) => -o.floor]
						: sortMethod === "floor"
						? [(o) => -o.floor, (o) => -o.count]
						: [(o) => o.listedAny, (o) => -o.floor, (o) => -o.count]
				)
					.filter((item) => item.count)
					.filter(
						(item) =>
							item.count >= filters.minOwned &&
							!(item.floor > filters.maxFloor) &&
							!(item.floor < filters.minFloor)
					)
					.map((card) => (
						<div
							key={card.uuid}
							className={`relative flex ${
								card.count === 0 ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"
							} flex-col items-center rounded border border-gray-500 text-gray-700 shadow-md transition-all dark:text-gray-300`}
							onClick={() => {
								selectedTemplates.some((e) => e.id === card.id)
									? setSelectedTemplates((prev) =>
											prev.filter((item) => item.id !== card.id)
									  )
									: setSelectedTemplates((prev) => [...prev, card]);
							}}
						>
							<div className='relative aspect-auto w-24 overflow-hidden rounded-md p-0.5 sm:w-36'>
								<ImageWrapper
									src={card.images?.size450 || `${CDN}${card.images[0]}`}
									width={200 * 1.5}
									height={300 * 1.5}
									alt={card.title}
									className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
										selectedTemplates.some((e) => e.id === card.id)
											? "border-main-500 grayscale-0"
											: "border-transparent"
									}`}
								/>
								{!selectedTemplates.some((e) => e.id === card.id) && (
									<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
								)}
							</div>
							{card.listedAny && (
								<div
									className='absolute right-2 top-2 flex h-6 w-7 items-center justify-center rounded bg-green-500 text-gray-900 dark:text-gray-100'
									title='Some items are already listed'
								>
									<AiOutlineShoppingCart size={18} />
								</div>
							)}
							<div className='mb-1 p-1 text-center text-sm'>{card.title}</div>
							<div className='mt-auto flex w-full border-y border-gray-400'>
								<span className='ml-1'>Floor:</span>
								<span className='ml-auto mr-1'>
									{card.floor ? "$" + card.floor : "-"}
								</span>
							</div>
							<div className='w-full text-center text-xs font-semibold text-main-500'>
								x
								<span className='text-base' title='Owned count'>
									{card.count}
								</span>
							</div>
						</div>
					))}
			</div>

			{showFiltersModal && (
				<FiltersModal
					isOpen={showFiltersModal}
					setIsOpen={setShowFiltersModal}
					filters={filters}
					setFilters={setFilters}
					defaultFilters={defaultFilters}
				/>
			)}
			{showAdvancedModal && (
				<AdvancedModal
					showModal={showAdvancedModal}
					setShowModal={setShowAdvancedModal}
					selectedTemplates={selectedTemplates}
					user={user}
					templates={templates}
				/>
			)}
			{showSimpleModal && (
				<SimpleModal
					showModal={showSimpleModal}
					user={user}
					setShowModal={setShowSimpleModal}
					selectedTemplates={selectedTemplates}
					templates={templates}
				/>
			)}
		</>
	);
};
export default CardGallery;
