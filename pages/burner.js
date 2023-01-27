import { useState } from "react";
import { useAxios } from "hooks/useAxios";
import SetSelector from "HOC/SetSelector";
import LoadingSpin from "@/components/LoadingSpin";
import Meta from "@/components/Meta";
import Tooltip from "@/components/Tooltip";

const Burner = () => {
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [collection, setCollection] = useState({ info: {}, items: [] });
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(false);
	const { fetchData } = useAxios();

	const getCollection = async () => {
		const { result, error } = await fetchData(
			`/api/collections/cards/${selectedCollection.collection.id}`
		);
		console.log(result);
		return result;
	};

	return (
		<>
			<Meta title='Mass Burner | Hro VIP' />
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
					{/* <RefreshButton
						title='Refresh Cards'
						func={getCards}
						loading={loading}
						style='absolute top-14 right-2 mt-2'
					/> */}
				</div>
			</div>
			{loading && (
				<div className='flex justify-center py-2'>
					<LoadingSpin />
				</div>
			)}
			<button className='button' onClick={getCollection}>
				FETCH
			</button>
		</>
	);
};
export default Burner;
