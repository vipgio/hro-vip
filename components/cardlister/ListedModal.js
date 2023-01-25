import { useContext, useEffect, useRef, useState } from "react";
import uniq from "lodash/uniq";
import { useAxios } from "hooks/useAxios";
import { UserContext } from "context/UserContext";
import ListedTable from "./ListedTable";
import BigModal from "../BigModal";

const ListedModal = ({ showModal, setShowModal }) => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const finished = useRef(false);
	const [listed, setListed] = useState([]);
	const [sortMethod, setSortMethod] = useState("mint");
	const [loading, setLoading] = useState(false);
	const [insertFloor, setInsertFloor] = useState(0);

	const updateSelectedItems = async () => {};

	const deleteSelectedItems = async () => {};

	const getAllListed = async (firstPage) => {
		setLoading(true);
		setShowModal(true);
		let page = firstPage;

		const data = await getListed(page);
		if (data.count > 0 && !finished.current) {
			const templateList = uniq(
				data.market.map((item) => {
					if (item.type === "card") return item.card.cardTemplateId;
				})
			).toString();
			const { result: templates } = await fetchData(`/api/cards/templates`, {
				cardIds: templateList,
			});
			const { result: floorData } = await fetchData(`/api/market/templates`, {
				templateIds: templateList,
				type: "card",
				page: 1,
				price: "asc",
			});
			setListed((prev) => [
				...prev,
				...data.market.map((item) => {
					const obj = {
						marketId: item.marketId,
						templateId: item.card.cardTemplateId,
						price: item.price,
						minOffer: item.minOffer,
						mintNumber: item.card.mintNumber,
						mintBatch: item.card.mintBatch,
						type: item.type,
						created: item.created,
						circulation: templates.filter((res) => res.id === item.card.cardTemplateId)[0]
							.inCirculation,
						title: templates.filter((res) => res.id === item.card.cardTemplateId)[0]
							.title,
						floor: floorData.templates.filter(
							(res) => res.entityTemplateId === item.card.cardTemplateId
						)[0].lowestPrice,
					};
					return obj;
				}),
			]);
			if (!finished.current) {
				setLoading(false);
				getAllListed(++page);
			}
		} else {
			finished.current = true;
			setLoading(false);
		}
	};

	const getListed = async (page) => {
		const { result, error } = await fetchData(
			`/api/market/listed/users/${user.user.id}`,
			{
				page: page,
			}
		);
		if (result) return result;
		if (error) console.log(error);
	};

	useEffect(() => {
		if (listed.length === 0) {
			setLoading(true);
			getAllListed(1);
		}
		return () => {
			setShowModal(false);
			finished.current = true;
		};
	}, []);

	return (
		<BigModal
			stopButton={
				!finished.current && (
					<button
						className='ml-2 rounded bg-red-400 p-1 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-600 dark:text-gray-200'
						onClick={() => {
							finished.current = true;
							setLoading(false);
						}}
						title='Stop loading the items'
					>
						Stop
					</button>
				)
			}
			loading={loading}
			header='Listed Items'
			showModal={showModal}
			setShowModal={setShowModal}
			closingFunction={() => (finished.current = true)}
			hasToast={true}
			extraStyle='h-fit my-auto'
		>
			<div className='flex h-16 min-h-[4rem] border border-gray-700 p-1 dark:border-gray-500'>
				<div className='flex items-center'>
					<label htmlFor='sort' className='ml-1 text-gray-700 dark:text-gray-300'>
						Sort by:{" "}
					</label>
					<select
						name='sort'
						id='sort'
						className='mx-2 my-1 rounded-md border border-gray-800 p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-main-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
						onChange={(e) => setSortMethod(e.target.value)}
					>
						{/* <option disabled selected value>
							Select an option
						</option> */}
						<option value='mint'>Mint</option>
						<option value='price'>Price</option>
						<option value='floor'>Floor</option>
						<option value='circulation'>Circulation</option>
					</select>
				</div>
				<button
					className='simple-button my-1.5 ml-auto mr-1.5'
					onClick={() => setInsertFloor((prev) => prev + 1)}
				>
					Insert Floor
				</button>
			</div>
			<div className='overflow-auto'>
				<ListedTable
					setListed={setListed}
					listed={listed}
					sortMethod={sortMethod}
					insertFloor={insertFloor}
				/>
			</div>
		</BigModal>
	);
};
export default ListedModal;
