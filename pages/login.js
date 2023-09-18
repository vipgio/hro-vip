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
	const [jwt, setJWT] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.get("/api/info", {
				headers: {
					jwt: jwt,
				},
			});
			console.log(data);
			setUser({
				user: {
					...data.data,
				},
				jwt: jwt,
				info: { allowed: [] },
			});
			setLoading(false);
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
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
						type='text'
						name='jwt'
						autoComplete='off'
						placeholder='JWT'
						value={jwt}
						onChange={(e) => setJWT(e.target.value)}
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						autoFocus
					/>

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
