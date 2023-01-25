import { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaGithub } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import Tooltip from "@/components/Tooltip";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpin from "@/components/LoadingSpin";

const Login = () => {
	const { setUser, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [codeEnabled, setCodeEnabled] = useState(false);
	const [code, setCode] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post("/api/login", { email, password, code });
			if (data.success) {
				const whitelist = await axios.get(
					`/api/whitelist?username=${data.data.user.username}`
				);

				if (whitelist.data.info?.banned) {
					toast.error("I don't like you, fuck off", {
						position: "top-center",
						toastId: "banned",
						progress: 1,
						closeOnClick: false,
					});
				} else {
					const now = new Date().getTime();
					const ends = Date.parse(whitelist.data.ends);
					whitelist.data.info
						? setUser((_) => {
								const expired = now > ends;
								return {
									...data.data,
									info: {
										transfers: whitelist.data.info.transfers || 0,
										allowed: expired ? [] : whitelist.data.info.allowed || [],
										...(!expired && {
											ends: Math.floor((ends - now) / (1000 * 3600 * 24)),
										}), //if not expired, add "ends"
									},
								};
						  })
						: setUser({ ...data.data, info: { allowed: [] } });
				}
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			if (!codeEnabled && err.response.data.errorCode === "2fa_invalid") {
				setCodeEnabled(true);
				toast.warning("Enter your 2FA code", {
					toastId: err.response.data.errorCode,
				});
			} else {
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
			setLoading(false);
		}
	};

	return (
		<>
			<ToastContainer
				position='top-right'
				hideProgressBar
				newestOnTop
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			{/* <div className='flex w-full'> */}
			<div className='absolute right-0 top-4' title='Source Code'>
				<a
					href='https://github.com/vipgio/hro-vip'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaGithub className='h-6 w-6 text-gray-700 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
			</div>
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<span className='pb-2 text-xl font-semibold text-gray-700 dark:text-gray-300'>
					Login using your Hro account
				</span>
				<form
					className='flex flex-col items-center space-y-2 rounded-md border border-gray-700 p-2 dark:border-gray-300'
					onSubmit={onSubmit}
				>
					<input
						type='email'
						name='email'
						placeholder='Email address'
						value={email}
						required={true}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete='email'
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>

					<input
						type='password'
						name='password'
						placeholder='Password'
						value={password}
						required={true}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete='current-password'
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>

					{codeEnabled && (
						<input
							type='text'
							name='2fa'
							placeholder='Two Factor Authentication'
							value={code}
							onChange={(e) => setCode(e.target.value)}
							disabled={loading}
							className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
							autoFocus
						/>
					)}
					<button type='submit' disabled={loading} className='submit-button'>
						{loading ? <LoadingSpin /> : "Login"}
					</button>
					<div className='pr-2 text-gray-700 dark:text-gray-300'>
						<Tooltip
							text={
								"Your password is never stored or sent to anywhere other than hro. If you have any questions you can check the source code or contact me on discord vipgio#4884"
							}
							direction='right'
						/>
					</div>
				</form>
				<div className='absolute bottom-0 h-8 w-full border-t border-gray-600 p-1 dark:border-gray-400'>
					<span className='text-sm text-gray-700 dark:text-gray-300'>
						Cool site logo by{" "}
						<a
							href='https://discordapp.com/users/341825527104929792'
							target='_blank'
							rel='noreferrer'
							className='text-main-500 hover:underline'
						>
							Nexus
						</a>
					</span>
				</div>
			</div>
		</>
	);
};
export default Login;
