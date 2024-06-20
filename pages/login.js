import { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import JWT from "@/components/login/JWT";
import TokenTutorial from "@/components/TokenTutorial";
import Link from "next/link";

const Login = () => {
	const { setUser } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	// const [email, setEmail] = useState("");
	// const [password, setPassword] = useState("");
	// const [code, setCode] = useState("");
	const [jwt, setJwt] = useState("");
	const [codeEnabled, setCodeEnabled] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);

	const handleCopyClick = async () => {
		try {
			await navigator.clipboard.writeText(
				`const info = {jwt: localStorage.getItem("new:jwt:token"), expires: localStorage.getItem("new:jwt:expires")};console.log(info);`
			);
			toast.success(`Code copied!`, {
				toastId: "copy",
				autoClose: 2000,
				hideProgressBar: false,
			});
		} catch (err) {
			console.log(err);
			toast.error(`Failed to copy the code :(`, { toastId: "failed" });
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.get("/api/info", {
				headers: {
					jwt: JSON.parse(jwt).jwt,
				},
			});
			console.log(data);
			setUser({
				user: {
					...data.data,
				},
				expires: JSON.parse(jwt).expires,
				jwt: JSON.parse(jwt).jwt,
				info: { allowed: ["history"] },
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
			<div className='text-primary-500 mt-16 flex h-1/4 w-full flex-col items-center justify-center lg:mt-11'>
				<p className='text-center'>
					<span className='block cursor-pointer underline' onClick={handleCopyClick}>
						Click to copy the code if you already know how it works
					</span>{" "}
				</p>
				<button className='simple-button mt-1' onClick={() => setShowTutorial(true)}>
					HOW
				</button>
			</div>

			<div
				className='absolute right-0 top-4 flex h-12 items-center justify-center rounded-b-md font-semibold text-gray-700 transition-colors dark:text-gray-300'
				title='Source Code'
			>
				<a href='https://github.com/vipgio/kolex-vip' target='_blank' rel='noopener noreferrer'>
					<FaGithub className='h-6 w-6 text-gray-700 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
				<a
					href='https://discordapp.com/users/473436055958192128'
					target='_blank'
					rel='noreferrer'
					title='Contact me on Discord'
					// className='rounded-full focus:outline-primary-500 focus-visible:outline-offset-4 focus-visible:outline-primary-500'
					className='my-outline mx-3 h-8 w-8 rounded-full focus-visible:ring-inset'
				>
					<FaDiscord className='h-full w-full hover:text-gray-600 dark:hover:text-gray-200' />
				</a>
				<Link href='/features'>
					<a className='my-outline text-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 mr-2 rounded bg-gray-100  p-1.5 transition-colors hover:bg-gray-200 focus-visible:ring-offset-1 active:bg-gray-300 dark:text-gray-100'>
						Features
					</a>
				</Link>
			</div>
			<div>
				<TokenTutorial showModal={showTutorial} setShowModal={setShowTutorial} />
			</div>

			<JWT
				jwt={jwt}
				loading={loading}
				setJwt={setJwt}
				toast={toast}
				setLoading={setLoading}
				setUser={setUser}
				onSubmit={onSubmit}
			/>
			<div className='absolute bottom-0 h-8 w-full border-t border-gray-600 p-1 dark:border-gray-400'>
				<span className='text-sm text-gray-700 dark:text-gray-300'>
					Cool site logo by{" "}
					<a
						href='https://discordapp.com/users/341825527104929792'
						target='_blank'
						rel='noreferrer'
						className='text-primary-500 hover:underline'
					>
						Nexus
					</a>
				</span>
			</div>
		</>
	);
};
export default Login;
