import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import { UserContext } from "context/UserContext";
import SetSelectorDropdown from "@/components/SetSelectorDropdown";

const seasons = ["Founders Edition", "2018", "2019", "2020", "2021", "2022", "2023"];

const SetSelector = React.memo(
	({ setSelectedCollection }) => {
		const { user } = useContext(UserContext);
		const [collections, setCollections] = useState([]);

		useEffect(() => {
			const groupCollections = async () => {
				const { data } = await getCollections();
				const grouped = groupBy(data, (col) => col.collection.properties.seasons[0]);
				Object.entries(grouped).forEach(([season, seasonCollections]) => {
					const eventsGrouped = groupBy(
						pickBy(
							seasonCollections,
							(col) => col.collection.properties.types[0] === "event_primary"
						),
						(col) => col.collection.properties.tiers[0]
					);

					const nonEventsGrouped = groupBy(
						pickBy(
							seasonCollections,
							(col) => col.collection.properties.types[0] !== "event_primary"
						),
						(col) => col.collection.properties.tiers[0]
					);
					setCollections((prev) => [
						...prev,
						[
							season,
							isEmpty(eventsGrouped)
								? Object.entries({
										...nonEventsGrouped,
								  })
								: Object.entries({
										Events: [...Object.entries(eventsGrouped)],
										...nonEventsGrouped,
								  }),
						],
					]);
				});
			};
			groupCollections();
		}, []);

		const getCollections = async () => {
			try {
				const { data } = await axios.get(
					`/api/collections/users/${user.user.id}/user-summary`,
					{
						params: {
							userId: user.user.id,
						},
						headers: {
							jwt: user.jwt,
						},
					}
				);
				return data;
			} catch (err) {
				console.log(err);
			}
		};

		return (
			<div>
				<SetSelectorDropdown
					collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
					setSelectedCollection={setSelectedCollection}
				/>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
SetSelector.displayName = "SetSelector";
export default SetSelector;
