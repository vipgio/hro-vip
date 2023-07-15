import { useContext, forwardRef, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { AiOutlineScan, AiOutlineHome, AiOutlineFire } from "react-icons/ai";
import { FaHistory, FaSearch, FaLock, FaMoon, FaSun, FaDiscord } from "react-icons/fa";
import { TbArrowMerge } from "react-icons/tb";
import { BsArrowLeftRight } from "react-icons/bs";
import { UserContext } from "context/UserContext";
import { ThemeContext } from "context/ThemeContext";
import BurgerMenuIcon from "./BurgerMenuIcon";
import TradeModal from "./trade/TradeModal";

const Navbar = () => {
	const { user, tradeList } = useContext(UserContext);
	const { theme, setTheme } = useContext(ThemeContext);
	const [showTradeModal, setShowTradeModal] = useState(false);
	const sendItems =
		tradeList.send && tradeList.send[0] ? tradeList.send[0].items.length : 0;
	const receiveItems = tradeList.receive
		? tradeList.receive.reduce(
				(previousValue, currentValue) => previousValue + currentValue.items.length,
				0
		  )
		: 0;
	const cardsInTrade = sendItems + receiveItems;
	return (
		user && (
			<nav className='flex h-12 items-center justify-center rounded-b-md bg-main-500 font-semibold text-gray-700 shadow-lg transition-colors dark:bg-slate-500 dark:text-gray-300'>
				<Menu as='div' className='relative z-30 inline-block h-full w-12 text-left'>
					{({ open }) => (
						<>
							<Menu.Button className='my-outline group inline-flex h-12 w-full items-center justify-center px-4 py-2 text-sm font-medium text-gray-100 focus-visible:ring-inset'>
								<BurgerMenuIcon open={open} />
							</Menu.Button>

							<Transition
								show={open}
								enter='transition ease-out duration-100'
								enterFrom='transform opacity-0 scale-95'
								enterTo='transform opacity-100 scale-100'
								leave='transition ease-in duration-75'
								leaveFrom='transform opacity-100 scale-100'
								leaveTo='transform opacity-0 scale-95'
							>
								<Menu.Items className='absolute left-0 mt-1 w-56 origin-top-left rounded-lg border border-gray-800 bg-gray-200 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-200 dark:bg-gray-800'>
									{pages.map((page) => (
										<Menu.Items key={page.link}>
											<Menu.Item>
												{({ active }) => (
													<MyLink
														href={
															page.paid
																? user.info.allowed.includes(page.link)
																	? `/${page.link}`
																	: "/features"
																: `/${page.link}`
														}
														className={`${
															active
																? "bg-main-500 fill-gray-200 text-gray-200 dark:bg-gray-200 dark:fill-gray-700 dark:text-gray-700"
																: "fill-gray-700 text-gray-700 dark:fill-gray-200 dark:text-gray-200"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors active:bg-gray-800 active:shadow-md dark:active:bg-gray-300`}
													>
														<span className='mr-1'>
															{page.paid ? (
																user.info.allowed.includes(page.link) ? (
																	page.icon
																) : (
																	<FaLock />
																)
															) : (
																page.icon
															)}
														</span>
														<span className='ml-1'>{page.title}</span>
														{page.new && (
															<span className='ml-auto rounded bg-red-500 p-1 text-xs text-gray-100'>
																New
															</span>
														)}
													</MyLink>
												)}
											</Menu.Item>
										</Menu.Items>
									))}
								</Menu.Items>
							</Transition>
						</>
					)}
				</Menu>
				<div className='ml-auto mt-1 mr-2'>
					{user.info.allowed.includes("trades") && (
						<button
							className='my-outline relative rounded text-gray-700 dark:text-gray-300'
							// onClick={() => console.log(tradeList)}
							onClick={() => setShowTradeModal(true)}
						>
							<BsArrowLeftRight
								className='h-5 w-5'
								title={
									cardsInTrade === 0
										? "No items in your trade list. Use the Scanner to add items"
										: "Trade"
								}
							/>
							{cardsInTrade !== 0 && (
								<div
									className='absolute top-1 right-full mr-1 font-semibold'
									title='Items in the trade list'
								>
									{cardsInTrade}
								</div>
							)}
						</button>
					)}
				</div>
				<button className='mx-2 h-5 w-5' tabIndex={-1}>
					<a
						href='https://discordapp.com/users/473436055958192128'
						target='_blank'
						rel='noreferrer'
						title='Contact me on Discord'
						className='rounded-full focus:outline-purple-500 focus-visible:outline-offset-4 focus-visible:outline-main-500'
					>
						<FaDiscord className='h-full w-full hover:text-gray-200' />
					</a>
				</button>
				<button
					className='my-outline mr-2 h-8 w-8 rounded-full focus-visible:ring-inset'
					onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
				>
					<div className='relative h-10 w-10 rounded-full' title='Change theme'>
						<FaSun
							className={`absolute top-1 left-1 h-6 w-6 animate-fadeIn cursor-pointer p-1 text-gray-300 transition-transform ${
								theme === "dark" ? "" : "animate-fadeOut opacity-0"
							}`}
						/>
						<FaMoon
							className={`absolute top-1 left-1 h-6 w-6 animate-fadeIn cursor-pointer p-1 text-gray-700 transition-transform  ${
								theme === "dark" ? "animate-fadeOut opacity-0" : ""
							}`}
						/>
					</div>
				</button>
				<Link href='/features'>
					<a className='my-outline mr-2 rounded bg-gray-100 p-1.5 text-main-500 transition-colors hover:bg-gray-200 focus-visible:ring-offset-1  active:bg-gray-300 dark:bg-main-500 dark:text-gray-100 dark:hover:bg-main-600 dark:active:bg-main-700'>
						Features
					</a>
				</Link>
				{showTradeModal && (
					<TradeModal showModal={showTradeModal} setShowModal={setShowTradeModal} />
				)}
			</nav>
		)
	);
};

export default Navbar;

const MyLink = forwardRef((props, ref) => {
	const { href, children, ...rest } = props;
	return (
		<Link href={href}>
			<a ref={ref} {...rest}>
				{children}
			</a>
		</Link>
	);
});
MyLink.displayName = "MyLink";

const pages = [
	{
		link: "",
		title: "Home Page",
		icon: <AiOutlineHome />,
		paid: false,
	},
	{
		link: "circulation",
		title: "Circulation",
		icon: (
			<svg viewBox='0 0 24 24' width='1em' height='1em'>
				<path d='M52.8,6.1L52.8,6.1c0-1.7,1.4-3,3-3h0.4h1.5h5.9c1.7,0,3,1.3,3,3v13c0,1.7-1.3,3-3,3l0,0l0,0h-2.1c-0.6,0-1-0.4-1-1 s0.4-1,1-1h2.1c0.6,0,1-0.4,1-1v-13c0-0.6-0.4-1-1-1h-5.9h-1.5h-0.4c-0.6,0-1,0.5-1,1v0.3l0,0l0,0v0.1l0,0v0.1l0,0 c0,0.5-0.5,0.9-1,0.9s-1-0.4-1-0.9V6.5l0,0L52.8,6.1L52.8,6.1z'></path>
				<path d='M18,1.6c-0.5-0.6-1.2-0.9-2.1-0.9L8.7,0.8c-2.3,0-4.1,1.9-4,4.1l0.2,11.9c0,0.6,0.2,1.2,0.6,1.7l0,0c0,0,0,0,0.1,0.1l0,0 l0,0l0,0l0,0l0.1,0.1C5.8,18.8,5.9,18.9,6,19l0.1,0.1c0.1,0,0.1,0.1,0.2,0.1c0.4,0.2,0.8,0.5,1.4,0.5s1-0.4,1-1 c0-0.5-0.3-0.8-0.8-0.9l0,0c-0.5-0.1-0.9-0.4-1-1L6.6,4.9c0-1.2,0.9-2.1,2.1-2.1l6.9-0.1c0.3,0,0.6,0.1,0.8,0.3 c0.2,0.2,0.4,0.4,0.7,0.4C18,3.5,18.6,2.3,18,1.6z'></path>
				<path d='M3.2,6.5C3.7,6.4,4,6,3.9,5.4s-0.5-0.9-1-0.9l0,0l0,0l0,0l0,0l0,0C1.1,4.8-0.2,6.3,0,8.1l1.4,12.7c0.2,1.6,1.6,2.8,3.3,2.7 L7,23.2l1.1-0.1C8.7,23,9,22.6,9,22c-0.1-0.6-0.5-1-1.1-0.9l-1.2,0.1l0,0l-2.2,0.2c-0.5,0.1-1-0.3-1.1-0.9L2,7.9 C2,7.2,2.6,6.6,3.2,6.5'></path>
				<path d='M0.5,5.6'></path>
				<path d='M13.3,3.7c-1.6-0.2-3.1,1.1-3.3,2.7L8.8,19.3c-0.2,1.6,1,3.1,2.7,3.3l8,0.8c1.6,0.2,3.1-1,3.3-2.7l0.2-2l0.6-6.8l0.1-0.6 v-0.1L24,7.8V7.7c0.2-1.6-1.1-3.1-2.7-3.3L13.3,3.7z M21.7,11L21.7,11v0.2v0.5l-0.8,8.8c0,0.5-0.5,1-1.1,0.9l-8-0.8 c-0.5,0-1-0.5-0.9-1.1L12,6.6c0-0.5,0.6-0.9,1.1-0.9l8,0.8c0.6,0.1,1,0.5,0.9,1.1L21.7,11z'></path>
				<path d='M53.5,9.6l-8.3-0.8c-1.6-0.2-3.1,1.1-3.3,2.7l-1.2,12.9c-0.1,1.6,1,3.1,2.7,3.3l8,0.7c1.6,0.1,3.1-1,3.3-2.7l0.2-2v-0.1 v-0.3v-0.1v-0.4l0.9-10C56.2,11.2,55.2,9.7,53.5,9.6z M45,10.8l8,0.7c0.5,0.1,1,0.5,0.9,1.1l-0.6,6c-0.1,0.6-0.5,1-1.1,0.9l-1.1-0.1 c-0.6-1.5-1.2-2.3-1.4-2.5c0.9-0.5,1.5-1.5,1.3-2.7c-0.2-0.8-0.8-1.5-1.7-1.7c-1.6-0.4-3,0.8-3,2.3c0,0.7,0.3,1.4,0.9,1.8 c-0.8,0.5-1.5,1.3-2.1,2.2l-0.8-0.1c-0.5-0.1-1-0.5-0.9-1.1l0.6-6C44,11.1,44.5,10.7,45,10.8z'></path>
			</svg>
		),
		paid: false,
	},
	{
		link: "packs",
		title: "Pack Search",
		icon: (
			<svg viewBox='0 0 24 24' width='1em' height='1em'>
				<path d='M21.7,3.6'></path>
				<path d='M33.2-10.5'></path>
				<path d='M5.6,22.7c0-0.5-0.4-1-0.9-1l-0.3,0c-0.7-0.1-1.4-0.6-1.4-1.5V3.8c0-0.6,0.4-1.2,1-1.4l0.1,0l0.5,0c0.5,0,0.9-0.5,0.9-1 c0-0.5-0.4-1-0.9-1l-0.1,0c-1.9,0-3.5,1.6-3.5,3.5v16.5c0,1.9,1.6,3.5,3.5,3.5h0.1C5.2,23.8,5.6,23.2,5.6,22.7z'></path>
				<path d='M20.7,0H8.9c-1.6,0-3,1.4-3,3v18c0,1.6,1.3,3,3,3h11.5c1.6,0,3-1.3,3-3V3.7V3.3v0V3.2v0C23.6,1.4,22.4,0,20.7,0z M21.4,21 c0,0.5-0.4,1-1,1H8.9c-0.5,0-1-0.4-1-1v-8H9c0.5,2.7,2.8,4.7,5.6,4.7s5.2-2,5.6-4.7h1.1V21z M15.6,13.8v-0.6L12,11.7 c-0.3-0.1-0.4-0.3-0.4-0.6V9.4c0-0.5,0.3-0.9,0.8-0.9h1.2V7.8h2v0.7h1.2c0.5,0,0.8,0.3,0.8,0.8v1.4h-2V10h-1.9v0.6l3.6,1.5 c0.3,0.1,0.4,0.3,0.4,0.6v1.7c0,0.5-0.3,0.9-0.8,0.9h-1.2V16h-2v-0.7h-1.2c-0.5,0-0.8-0.3-0.8-0.9v-1.5h2v0.9H15.6z M21.4,3.2 L21.4,3.2v0.1v0.1V11h-1.1c-0.5-2.7-2.8-4.7-5.6-4.7S9.5,8.3,9,11H7.9V3c0-0.5,0.5-1,1-1h11.5c0.6,0,1,0.4,1,1V3.2z'></path>
			</svg>
		),
		paid: false,
	},
	{
		link: "scanner",
		title: "Scanner",
		icon: <AiOutlineScan className='scale-105' />,
		paid: false,
	},
	// {
	// 	link: "crafting",
	// 	title: "Crafting",
	// 	icon: <TbArrowMerge className='scale-125' />,
	// 	paid: false,
	// },
	{
		link: "packmanager",
		title: "Pack Manager",
		icon: (
			<svg
				width='14'
				height='14'
				viewBox='0 0 512 512'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M507.519,116.384C503.721,111.712,498.021,109,492,109H129.736l-1.484-13.632l-0.053-0.438C121.099,40.812,74.583,0,20,0 C8.954,0,0,8.954,0,20s8.954,20,20,20c34.506,0,63.923,25.749,68.512,59.928l23.773,218.401C91.495,327.765,77,348.722,77,373 c0,0.167,0.002,0.334,0.006,0.5C77.002,373.666,77,373.833,77,374c0,33.084,26.916,60,60,60h8.138 c-2.034,5.964-3.138,12.355-3.138,19c0,32.532,26.467,59,59,59s59-26.468,59-59c0-6.645-1.104-13.036-3.138-19h86.277 c-2.034,5.964-3.138,12.355-3.138,19c0,32.532,26.467,59,59,59c32.533,0,59-26.468,59-59c0-32.532-26.467-59-59-59H137 c-11.028,0-20-8.972-20-20c0-0.167-0.002-0.334-0.006-0.5c0.004-0.166,0.006-0.333,0.006-0.5c0-11.028,8.972-20,20-20h255.331 c35.503,0,68.084-21.966,83.006-55.962c4.439-10.114-0.161-21.912-10.275-26.352c-10.114-4.439-21.912,0.161-26.352,10.275 C430.299,300.125,411.661,313,392.331,313h-240.39L134.09,149h333.308l-9.786,46.916c-2.255,10.813,4.682,21.407,15.495,23.662 c1.377,0.288,2.75,0.426,4.104,0.426c9.272,0,17.59-6.484,19.558-15.92l14.809-71C512.808,127.19,511.317,121.056,507.519,116.384 z M399,434c10.477,0,19,8.523,19,19s-8.523,19-19,19s-19-8.523-19-19S388.523,434,399,434z M201,434c10.477,0,19,8.524,19,19 c0,10.477-8.523,19-19,19s-19-8.523-19-19S190.523,434,201,434z'></path>
			</svg>
		),
		// paid: true,
	},
	{ link: "mintsearch", title: "Mint Search", icon: <FaSearch /> },
	{
		link: "history",
		title: "History",
		icon: <FaHistory />,
		// paid: true
	},
	{
		link: "cardlister",
		title: "Card Lister",
		icon: (
			<svg width='15' height='16' viewBox='0 0 28 24'>
				<path d='M7.67353846,0 C6.87692308,0 6.23076923,0.64 6.23076923,1.42818182 C6.23076923,2.21727273 6.87692308,2.85727273 7.67353846,2.85727273 L16.3264615,2.85727273 C17.1230769,2.85727273 17.7692308,2.21727273 17.7692308,1.42818182 C17.7692308,0.64 17.1230769,0 16.3264615,0 L7.67353846,0 Z M3.34615385,5.71454545 C3.34615385,4.92545455 3.99230769,4.28545455 4.78892308,4.28545455 L19.212,4.28545455 C20.0076923,4.28545455 20.6538462,4.92545455 20.6538462,5.71454545 C20.6538462,6.50363636 20.0076923,7.14272727 19.212,7.14272727 L4.78892308,7.14272727 C3.99230769,7.14272727 3.34615385,6.50363636 3.34615385,5.71454545 Z M0.461538462,11.4281818 C0.461538462,9.85090909 1.75292308,8.57181818 3.34615385,8.57181818 L20.6538462,8.57181818 C22.2470769,8.57181818 23.5384615,9.85090909 23.5384615,11.4281818 L23.5384615,17.1427273 C23.5384615,18.7209091 22.2470769,20 20.6538462,20 L3.34615385,20 C1.75292308,20 0.461538462,18.7209091 0.461538462,17.1427273 L0.461538462,11.4281818 Z'></path>
			</svg>
		),
		// paid: true,
	},
	// {
	// 	link: "transfer",
	// 	title: "Account Transfer",
	// 	icon: <FaPeopleArrows size={16} />,
	// 	paid: true,
	// },
	// {
	// 	link: "burner",
	// 	title: "Mass Burner",
	// 	icon: <AiOutlineFire size={16} />,
	// 	paid: true,
	// },
];
