import { useContext, useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { UserContext } from "context/UserContext";
import Toggle from "./Toggle";
import TradeInfoBox from "./TradeInfoBox";
import BigModal from "../BigModal";

const TradeModal = ({ showModal, setShowModal }) => {
	const { tradeList, setTradeList } = useContext(UserContext);
	const [tradeType, setTradeType] = useState("receive");
	const dataToShow =
		tradeType === "send" ? tradeList.send || [] : sortBy(tradeList.receive, "owner");
	const myItems = tradeList.send && tradeList.send[0];

	return (
		<BigModal
			header='Trades'
			showModal={showModal}
			setShowModal={setShowModal}
			closeOnClick={true}
		>
			<div className='my-3'>
				<Toggle action={tradeType} setAction={setTradeType} />
			</div>
			<div className='h-[30rem] max-h-full overflow-auto'>
				<div
					className={`p-2 text-gray-700 dark:text-gray-300 ${
						tradeType === "send" ? "flex justify-center" : ""
					}`}
				>
					{dataToShow.map((user) => (
						<TradeInfoBox
							user={user}
							key={user.id || "me"}
							myItems={myItems}
							setTradeList={setTradeList}
						/>
					))}
				</div>
			</div>
		</BigModal>
	);
};
export default TradeModal;
