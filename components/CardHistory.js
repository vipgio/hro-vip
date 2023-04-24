import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import ImageWrapper from "HOC/ImageWrapper";
const CardHistory = React.memo(
	({ item }) => {
		return (
			<>
				<div className='m-5 flex basis-11/12 items-start rounded border border-gray-700 p-2 dark:border-gray-300 lg:basis-[calc(50%_-_40px)]'>
					{item.images.size450 && (
						<div className='mr-2 min-w-fit'>
							<ImageWrapper
								src={
									item.images.size450 ? item.images.size450 : item.template.images.size450
								}
								alt={item.id}
								width={50 * 1.5}
								height={75 * 1.5}
							/>
						</div>
					)}
					<div className='w-full'>
						<div className='mb-2 w-full border-b border-current text-gray-800 dark:text-gray-200'>
							<span className='text-main-400'>
								{item.mintBatch}
								{item.mintNumber}{" "}
							</span>
							<span>
								{item.template?.title}: {item.id}
							</span>
						</div>

						<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-800 dark:text-gray-200'>
							{item.history
								.slice()
								.reverse()
								.map((event) => (
									<Fragment key={`${item.id}-${event.created}`}>
										{event.type === "mint" && (
											<div>Minted on {event.created.replace("T", " ").split(".")[0]}</div>
										)}

										{event.type === "pack" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												opened from a pack.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "craft" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from a craft.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "qr-claim" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												acquired from a QR code redemption.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "achievement" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from an achievement.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "trade" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from{" "}
												<span className='font-medium text-red-400'>
													{event.sender.username}{" "}
												</span>
												in a trade.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "market" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver ? event.receiver.username : "null"}{" "}
												</span>
												purchased the item from{" "}
												<span className='font-medium text-red-400'>
													{event.sender.username}{" "}
												</span>
												for <span>{event.value} </span>
												<span>USD</span>
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-locked" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver
														? event.receiver.username
														: event.sender.username}{" "}
												</span>
												transferred the item to Immutable.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-unlocked" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver
														? event.receiver.username
														: event.sender.username}{" "}
												</span>
												transferred the item to Hro.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-market" && (
											<div>
												{event.receiver ? (
													<>
														<span className='font-medium text-green-600 dark:text-green-400'>
															{event.receiver.username}{" "}
														</span>
														purchased the item from Immutable
														{event.value > 0 ? (
															<>
																{" "}
																for
																<span className='ml-1 font-semibold text-red-500'>
																	{event.value}
																</span>
																ETH.{" "}
															</>
														) : (
															"."
														)}
													</>
												) : (
													<>
														<span className='font-medium text-green-600 dark:text-green-400'>
															{event.sender ? event.sender.username : "null"}{" "}
														</span>
														sold the item on Immutable
														{event.value > 0 ? (
															<>
																{" "}
																for
																<span className='ml-1 font-semibold text-red-500'>
																	{event.value}
																</span>
																ETH.{" "}
															</>
														) : (
															"."
														)}
													</>
												)}

												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "eth-owner-update" && (
											<div>
												Ethereum item ownership updated.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "eth-locked" && (
											<div>
												Ethereum token trading disabled.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
									</Fragment>
								))}
						</div>
					</div>
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CardHistory.displayName = "CardHistory";
export default CardHistory;
