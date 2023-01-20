import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { HiOutlineArrowCircleRight, HiOutlineArrowCircleLeft } from "react-icons/hi";

import { UserContext } from "context/UserContext";
import { CDN } from "@/config/config";
import PackSelection from "./PackSelection";
import ModalPage2 from "./ModalPage2";
import BigModal from "../BigModal";

const MassPackModal = ({ packTemplate, showModal, setShowModal }) => {
	const { user } = useContext(UserContext);
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState([]);
	const [action, setAction] = useState("list");
	const [marketInfo, setMarketInfo] = useState({});
	//set marketInfo equal to getmarketInfo function value
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getMarketInfo(packTemplate.id);
			setMarketInfo(data);
		};
		fetchData();
	}, []);

	const getMarketInfo = async (packId) => {
		const { data } = await axios.get(`/api/market/pack/${packId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<BigModal
			header={packTemplate.name}
			showModal={showModal}
			setShowModal={setShowModal}
			closeOnClick={true}
			hasToast={true}
		>
			{page === 1 ? (
				<PackSelection
					packTemplate={packTemplate}
					selected={selected}
					setSelected={setSelected}
					marketInfo={marketInfo}
					CDN={CDN}
					setPage={setPage}
				/>
			) : (
				<ModalPage2
					selected={selected}
					setSelected={setSelected}
					packTemplate={packTemplate}
					action={action}
					setAction={setAction}
					setPage={setPage}
					CDN={CDN}
				/>
			)}
			<Footer
				page={page}
				setPage={setPage}
				disabled={selected.length > 0 ? false : true}
			/>
		</BigModal>
	);
};
export default MassPackModal;

const Footer = ({ page, setPage, disabled }) => {
	return (
		<div className='relative bottom-0 z-20 mt-auto mb-1 flex h-10 border-t border-gray-700 pt-2 text-gray-800 dark:border-gray-300 dark:text-gray-300'>
			{page === 1 ? (
				<div
					className={`${
						disabled
							? "cursor-not-allowed text-gray-400"
							: "cursor-pointer hover:text-main-500"
					} ml-auto mr-4 flex`}
					onClick={() => !disabled && setPage(2)}
				>
					<span className='mr-1'>Next </span>
					<HiOutlineArrowCircleRight size={22} />
				</div>
			) : (
				<div
					className='mr-auto ml-4 flex cursor-pointer hover:text-main-500'
					onClick={() => setPage(1)}
				>
					<HiOutlineArrowCircleLeft size={22} />
					<span className='ml-1'>Back </span>
				</div>
			)}
		</div>
	);
};
