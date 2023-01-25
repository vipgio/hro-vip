import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import min from "lodash/min";
import max from "lodash/max";
import LoadingSpin from "@/components/LoadingSpin";
import Tooltip from "@/components/Tooltip";
import "react-toastify/dist/ReactToastify.css";
import BigModal from "../BigModal";

const SimpleModal = ({ selectedTemplates, showModal, setShowModal, user }) => {
	const [loading, setLoading] = useState(false);
	const [selectedCards, setSelectedCards] = useState([]);
	const [cardDetails, setCardDetails] = useState([]);
	const [price, setPrice] = useState(0);
	const defaultFilters = {
		batch: "A",
		max: 5000,
		min: 100,
	};
	const [filters, setFilters] = useState(defaultFilters);

	useEffect(() => {
		//filter based on mint range
		if (!isEqual(defaultFilters, filters)) {
			setSelectedCards(
				cardDetails
					.map((item) =>
						item.cards.filter(
							(card) => card.mintNumber >= filters.min && card.mintNumber <= filters.max
						)
					)
					.flat()
			);
		}
	}, [filters]);

	useEffect(() => {
		//fetch owned cards
		let isApiSubscribed = true;
		const controller = new AbortController();
		setCardDetails([]);
		setLoading(true);
		for (const template of selectedTemplates) {
			const fetchData = async () => {
				const data = await getCardTemplates(
					user.user.id,
					template.id,
					"card",
					controller
				);
				if (data.success) {
					const strippedCards = data.data
						.map((item) => {
							return {
								entityTemplateId: template.id,
								id: item.id,
								type: "card",
								mintNumber: item.mintNumber,
								mintBatch: item.mintBatch,
								status: item.status,
								title: template.title,
							};
						})
						.filter((item) => item.status === "available");
					setCardDetails((prev) => [
						...prev,
						{
							...template,
							cards: sortBy(strippedCards, ["mintBatch", "mintNumber"]).reverse(),
						},
					]);
				}
			};
			if (isApiSubscribed) {
				try {
					fetchData();
				} catch (err) {
					console.log(err);
				}
			}
		}
		setLoading(false);

		return () => {
			controller.abort();
			isApiSubscribed = false;
		};
	}, []);

	const listAll = async () => {
		setLoading(true);
		let counter = 0;
		for await (const item of selectedCards) {
			try {
				const { data } = await axios.post(
					`/api/market/list/${item.id}`,
					{
						data: {
							price: price,
							type: item.type,
						},
					},
					{
						headers: {
							jwt: user.jwt,
						},
					}
				);
				if (data.success) {
					counter++;
					toast.isActive("success")
						? toast.update("success", {
								render: `Listed ${counter}x ${
									counter === 1 ? "item" : "items"
								} on the market for $${price}!`,
						  })
						: toast.success(
								`Listed ${counter}x ${
									counter === 1 ? "item" : "items"
								} on the market for $${price}!`,
								{
									toastId: "success",
								}
						  );
				}
			} catch (err) {
				console.log(err);
				toast.error(`Failed to list item with id: ${item.id}`, { toastId: item.id });
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
		}

		setLoading(false);
	};

	const getCardTemplates = async (userId, templateId, type, controller) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/card-templates`, {
			signal: controller.signal,
			params: {
				templateId: templateId,
				type: type,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<BigModal
			header='Items'
			loading={cardDetails.length < selectedTemplates.length}
			showModal={showModal}
			setShowModal={setShowModal}
			extraStyle='h-fit my-auto'
			hasToast={true}
		>
			<div className='flex w-full border border-gray-400'>
				<div className='max-h-96 w-1/2 divide-y divide-gray-500 overflow-auto p-1 text-gray-900 dark:text-gray-200'>
					{cardDetails &&
						cardDetails.map((item) => (
							<div key={item.id} className='flex'>
								<span className='ml-1'>{item.title}</span>
								<span className='ml-auto mr-1 self-center text-main-500'>
									x{item.cards?.length}
								</span>
							</div>
						))}
				</div>
				<div className='w-1/2 border-l border-gray-400'>
					{/* right half, inputs */}
					<div className='flex flex-col p-1 text-gray-900 dark:text-gray-200'>
						<div>
							<span className='text-main-500'>A) </span>
							Choose a mint range:
						</div>
						<div>
							<label htmlFor='max'>Highest mint:</label>
							<input
								type='number'
								name='max'
								id='max'
								min={1}
								max={30000}
								value={filters.max}
								disabled={cardDetails.length !== selectedTemplates.length}
								className='diasbled:opacity-50 input-field my-1 ml-1 w-24 disabled:hover:cursor-not-allowed'
								onChange={(e) => setFilters((prev) => ({ ...prev, max: e.target.value }))}
							/>
						</div>
						<div>
							<label htmlFor='min'>Lowest mint:</label>
							<input
								type='number'
								name='min'
								id='min'
								min={1}
								max={30000}
								value={filters.min}
								disabled={cardDetails.length !== selectedTemplates.length}
								className='diasbled:opacity-50 input-field my-1 ml-1 w-24 disabled:hover:cursor-not-allowed'
								onChange={(e) => setFilters((prev) => ({ ...prev, min: e.target.value }))}
							/>
						</div>
					</div>
					<div className='relative z-10 overflow-hidden text-center text-xl text-gray-900 before:absolute before:top-1/2 before:ml-[-44%] before:h-px before:w-5/12 before:bg-gray-400 before:text-right before:content-[""] after:absolute after:top-1/2 after:ml-[2%] after:h-px after:w-5/12 after:bg-gray-400 after:content-["\a0"] dark:text-gray-100'>
						OR
					</div>
					<div className='flex flex-col p-1 text-gray-900 dark:text-gray-200'>
						<div>
							<span className='text-main-500'>B) </span>
							{selectedTemplates.length === 1
								? "Enter the number of cards:"
								: "Enter the number of sets:"}
						</div>
						<div className='flex flex-col'>
							<div className='flex items-center'>
								<label htmlFor='count' className='mr-1'>
									{selectedTemplates.length === 1 ? "Cards:" : "Sets:"}
								</label>
								<input
									type='number'
									name='count'
									id='count'
									min={0}
									max={min(cardDetails.map((item) => item.cards.length))}
									disabled={cardDetails.length !== selectedTemplates.length}
									className='diasbled:opacity-50 input-field my-1 w-24 disabled:hover:cursor-not-allowed'
									onChange={(e) => {
										setFilters(defaultFilters);
										setSelectedCards([
											...cardDetails
												.map((template) => template.cards.slice(0, e.target.value))
												.flat(),
										]);
									}}
								/>
								<span className='hidden lg:block'>
									<Tooltip text='Picks the worst mints for each item' direction='right' />
								</span>
								<span className='ml-1 block lg:hidden'>
									<Tooltip text='Picks the worst mints for each item' direction='left' />
								</span>
							</div>
							<div>Max: {min(cardDetails.map((item) => item.cards.length))}</div>
						</div>
					</div>
					<div className='my-auto flex items-center border-t border-gray-600 p-1 pt-2 dark:border-gray-300'>
						<label htmlFor='price' className='text-gray-800 dark:text-gray-200'>
							Price:
						</label>
						<input
							type='number'
							name='price'
							id='price'
							min={1}
							max={200000}
							step={0.01}
							className='input-field ml-1'
							onChange={(e) => setPrice(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<div className='ml-1 p-1 text-gray-900 dark:text-gray-200'>
				<div>
					Floor range:{" "}
					<span>
						${min(selectedTemplates.map((item) => Number(item.floor)).filter((o) => o))}
					</span>
					{" - "}
					<span>
						${max(selectedTemplates.map((item) => Number(item.floor)).filter((o) => o))}
					</span>
				</div>
			</div>

			<div className='flex items-center border-t border-gray-400 p-2 dark:border-gray-200'>
				<div className='text-main-500'>Count: {selectedCards.length}</div>

				<div className='ml-auto mt-2 self-center sm:mt-0 sm:mb-0'>
					<button
						disabled={
							cardDetails.length !== selectedTemplates.length ||
							!price ||
							!selectedCards.length
						}
						onClick={listAll}
						className='button sm:mb-0'
					>
						{loading ? <LoadingSpin size={4} /> : "List items"}
					</button>
				</div>
			</div>
		</BigModal>
	);
};
export default SimpleModal;
