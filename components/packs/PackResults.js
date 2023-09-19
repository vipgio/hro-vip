import React, { useState } from "react";
import isEqual from "lodash/isEqual";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import PackOdds from "./PackOdds";

const PackResults = React.memo(
	({ pack }) => {
		const [showOdds, setShowOdds] = useState(false);
		return (
			<div className='relative m-2 flex border-t border-gray-700 p-2 dark:border-gray-300'>
				<div className='w-4/12 pt-1 sm:w-1/5'>
					<ImageWrapper
						src={`${CDN}${
							pack.images.filter((images) => images.name === "image")[0].url
						}`}
						width={200}
						height={200}
						alt={pack.name}
					/>
				</div>
				<div className='mx-2 w-8/12 space-y-1 text-gray-800 dark:text-gray-200 sm:w-4/5'>
					<div className='mb-2 text-lg font-bold' onClick={() => console.log(pack)}>
						{pack.name}
					</div>
					<div>{pack.description}</div>
					<div>
						Number of items in pack:{" "}
						<span className='font-semibold text-indigo-500'>{pack.entityCount}</span>
					</div>
					{pack.purchaseStart && (
						<div>
							Release date:{" "}
							<span className='font-semibold text-indigo-500'>
								{pack.purchaseStart.split("T")[0]}
							</span>
						</div>
					)}
					{pack.marketStart && (
						<div>
							Market start:{" "}
							<span className='font-semibold text-indigo-500'>{pack.marketStart}</span>
						</div>
					)}
					<div>
						Total Minted:{" "}
						<span className='font-semibold text-indigo-500'>{pack.mintCount}</span>
					</div>
					<div>
						Inventory Count:{" "}
						<span className='font-semibold text-indigo-500'>{pack.inventoryCount}</span>
					</div>
					{pack.burned ? (
						<div>
							Total Burned:{" "}
							<span className='font-semibold text-indigo-500'>{pack.burned}</span>
						</div>
					) : null}
					{pack.openedCount ? (
						<div>
							Total Opened:{" "}
							<span className='font-semibold text-indigo-500'>{pack.openedCount}</span>
						</div>
					) : null}
					{pack.openedCount ? (
						<div>
							Packs Unopened:{" "}
							<span className='font-semibold text-orange-500'>
								{pack.mintCount - pack.openedCount}
							</span>
						</div>
					) : null}

					<div>
						Season:{" "}
						<span className='font-semibold text-indigo-500'>
							{pack.properties.seasons[0]}
						</span>
					</div>
					{pack.cost && (
						<div>
							Price:{" "}
							<span className='font-semibold text-indigo-500'>
								{Number(pack.cost).toLocaleString()}{" "}
								{pack.costType[0].toUpperCase() + pack.costType.slice(1)}
							</span>
						</div>
					)}
					<div>
						Pack ID: <span className='font-semibold text-indigo-500'>{pack.id}</span>
					</div>
					<div className='flex'>
						Link to marketplace:
						<a
							href={`https://kolex.gg/csgo/marketplace/pack/${pack.id}`}
							className='ml-1 flex items-center text-indigo-500 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Here
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={1}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
								/>
							</svg>
						</a>
					</div>
					<div className='flex'>
						Link to drop page:
						<a
							href={`https://kolex.gg/csgo/drop/${pack.id}`}
							className='ml-1 flex items-center text-indigo-500 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Here
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={1}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
								/>
							</svg>
						</a>
					</div>
					<button onClick={() => setShowOdds((prev) => !prev)} className='simple-button'>
						{showOdds ? "Hide odds" : "Show odds"}
					</button>
					{showOdds && <PackOdds odds={pack.treatmentsChance} />}
				</div>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
PackResults.displayName = "PackResults";
export default PackResults;
