import { useContext, useState, useEffect } from "react";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import PackResults from "components/PackResults";
import Tooltip from "components/Tooltip";
import LoadingSpin from "@/components/LoadingSpin";

const PackSearch = () => {
	const { getPacks, loading, setLoading } = useContext(UserContext);
	const [packs, setPacks] = useState([]);

	useEffect(() => {
		refreshPacks();
	}, []);

	const getAllPacks = async (page) => {
		getPacks(page).then((res) => {
			if (res.data.success)
				if (res.data.data.length > 0) {
					setPacks((prev) => [
						...prev,
						...res.data.data.map((item) =>
							pick(item, [
								"id",
								"name",
								"description",
								"entityCount",
								"inventoryCount",
								"cost",
								"costType",
								"images",
								"properties",
								"purchaseStart",
								"marketStart",
								"treatmentsChance",
								"userLimit",
								"burned",
							])
						),
					]);
					getAllPacks(++page);
				} else {
					setLoading(false);
				}
		});
	};

	const refreshPacks = () => {
		setLoading(true);
		setPacks([]);
		getAllPacks(1);
	};

	return (
		<>
			<Meta title='Pack Search | Hro VIP' />
			<div className='mt-10 flex flex-col justify-center divide-y divide-gray-700 dark:divide-gray-300'>
				{loading ? (
					<div className='inline-flex justify-center'>
						<LoadingSpin />
					</div>
				) : (
					packs
						.sort((a, b) => b.id - a.id)
						.map((res) => <PackResults pack={res} key={res.id} />)
				)}
			</div>
		</>
	);
};
export default PackSearch;
