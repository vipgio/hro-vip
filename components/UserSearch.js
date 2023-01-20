import { useState, useCallback, useEffect } from "react";
import Image from "next/future/image";
import debounce from "lodash/debounce";
import { CDN } from "@/config/config";
import { useAxios } from "hooks/useAxios";

const UserSearch = ({ setSelectedUser, selectedUser, allowed = true }) => {
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);

	useEffect(() => {
		searchQuery.length === 0 && setResults([]);
	}, [searchQuery]);

	const searchUser = async (username) => {
		const { result, error } = await fetchData(`/api/users/search?username=${username}`);
		if (result) {
			return result;
		} else {
			console.log(error);
		}
	};

	const handleDebounce = async (input) => {
		if (input.length > 2) {
			setLoading(true);
			const result = await searchUser(input);
			setResults(result);
			setLoading(false);
		}
	};

	const debounceSearch = useCallback(debounce(handleDebounce, 1000), []);

	return (
		<div>
			<form onSubmit={(e) => e.preventDefault()} className='px-2'>
				<input
					type='text'
					onChange={(e) => {
						debounceSearch(e.target.value);
						setSearchQuery(e.target.value);
					}}
					value={searchQuery}
					className='input-field m-2'
					disabled={loading || !allowed}
					placeholder='Search for a user'
				/>
			</form>
			{searchQuery.length > 1 && (
				<div className='flex overflow-auto'>
					{results?.slice(0, 15).map((result) => (
						<button
							className={`${
								result.id === selectedUser?.id ? "bg-gray-500" : "hover:bg-gray-600"
							} mx-4 my-2 flex w-fit min-w-[8rem] flex-col items-center rounded-md border border-gray-400 p-2 text-gray-700 transition-all hover:cursor-pointer hover:text-gray-300 active:scale-110 active:bg-gray-500 dark:hover:text-gray-300`}
							key={result.id}
							onClick={() => {
								setSelectedUser(result);
								setSearchQuery("");
								setResults([]);
							}}
						>
							<div className='relative flex h-16 w-16 overflow-hidden rounded-full border'>
								<Image
									src={`${CDN}${result.avatar}`}
									alt={result.username}
									width={64}
									height={64}
									quality={80}
									className='object-cover'
									sizes='33vw'
									unoptimized={true}
								/>
							</div>
							<span className='mt-2 font-semibold text-gray-700 dark:text-gray-300'>
								{result.username}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
export default UserSearch;
