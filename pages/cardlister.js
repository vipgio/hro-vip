import { useState, useContext, useEffect } from "react";
import axios from "axios";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import SetSelector from "HOC/SetSelector";
import Meta from "@/components/Meta";
import LoadingSpin from "@/components/LoadingSpin";
import CardGallery from "@/components/cardlister/CardGallery";
import ListedModal from "@/components/cardlister/ListedModal";
import Tooltip from "@/components/Tooltip";
import RefreshButton from "@/components/RefreshButton";

const Cardlister = () => {
	const { user } = useContext(UserContext);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [templates, setTemplates] = useState([]);
	const [showListedModal, setShowListedModal] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		selectedCollection && getCards();
	}, [selectedCollection]);

	const getCards = async () => {
		setLoading(true);
		setTemplates([]);
		try {
			const { data: templates } = await getCollection(selectedCollection.collection.id);
			const { data: cards } = await getCardIds(
				user.user.id,
				selectedCollection.collection.id
			);
			const { data: owned } = await getOwned(
				user.user.id,
				selectedCollection.collection.id
			);
			if (templates) {
				const countedTemplates = templates.map((card) => {
					const count = cards.find((o) => o.cardTemplateId === card.id);
					return {
						...pick(card, [
							"id",
							"title",
							"images",
							"inCirculation",
							"cardType",
							"treatmentId",
							"uuid",
						]),
						count: count ? count.cardIds.length : 0,
						type: "card",
						listedAny: owned.cards.some(
							(own) => own.cardTemplateId === card.id && own.status === "market"
						),
					};
				});
				setTemplates(countedTemplates);
				await getAllMarket(
					templates.filter((item) => item.cardType),
					1,
					"card"
				);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	const getCollection = async (collectionId) => {
		const { data: cards } = await axios.get(`/api/collections/cards/${collectionId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		const result = {
			success: cards.success,
			data: cards.data,
		};
		return result;
	};

	const getCardIds = async (userId, collectionId) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/cardids`, {
			params: {
				collectionId: collectionId,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	const getAllMarket = async (cards, firstPage, type) => {
		let page = firstPage;
		if (cards.length > 0)
			try {
				const data = await getMarketInfo(cards, page, type);
				if (data.success && data.data.templates.length > 0) {
					setTemplates((prev) =>
						prev.map((temp) => {
							const index = data.data.templates.findIndex(
								(o) => o.entityTemplateId === temp.id
							);
							if (index !== -1) {
								return {
									...temp,
									floor: data.data.templates[index]?.lowestPrice,
								};
							} else {
								return temp;
							}
						})
					);
					if (data.data.templates.length > 0) getAllMarket(cards, ++page, type);
					return data;
				}
			} catch (err) {
				console.log(err);
			}
	};

	const getMarketInfo = async (templates, page, type) => {
		try {
			const { data } = await axios.get(`/api/market/templates`, {
				params: {
					templateIds: templates.map((o) => o.id).toString(),
					type: type,
					page: page,
					price: "asc",
				},
				headers: {
					jwt: user.jwt,
				},
			});
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const getOwned = async (userId, collectionId) => {
		const { data } = await axios.get(`/api/users/scan`, {
			params: {
				collectionId: collectionId,
				userId: userId,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<>
			<Meta title='Card Lister | Hro VIP' />
			<div className='flex'>
				<div className='flex flex-col'>
					<div className='mt-10 px-2 pt-2 font-semibold text-gray-700 dark:text-gray-300'>
						Selected Collection:
						{selectedCollection && (
							<span>
								{" "}
								{selectedCollection.collection.properties.seasons[0]} -{" "}
								{selectedCollection.collection.properties.tiers[0]} -{" "}
								{selectedCollection.collection.name}
							</span>
						)}
					</div>
					<SetSelector setSelectedCollection={setSelectedCollection} />
				</div>
				<div className='ml-auto mr-2 mb-2 flex items-end'>
					<RefreshButton
						title='Refresh Cards'
						func={getCards}
						loading={loading}
						style='absolute top-14 right-2 mt-2'
					/>
					<div className='flex items-center'>
						<Tooltip
							direction='left'
							text={`It will load ALL your items. If you have too many it's gonna take a while or you can stop loading the items by clicking on "Stop".`}
						/>
						<button className='button' onClick={() => setShowListedModal(true)}>
							Edit All Listings
						</button>
					</div>
				</div>
			</div>
			{loading && (
				<div className='flex justify-center py-2'>
					<LoadingSpin />
				</div>
			)}
			{templates.length > 0 && <CardGallery templates={templates} user={user} />}
			{showListedModal && (
				<ListedModal showModal={showListedModal} setShowModal={setShowListedModal} />
			)}
		</>
	);
};
export default Cardlister;
