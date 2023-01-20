import Head from "next/head";

const Meta = ({
	title,
	keywords = "hro, hroGG, hrogg, hro Toolkit, hro, hroGG, hrogg, hro Toolkit",
	description = "An epic and kool toolkit for hro.gg",
	robots,
}) => {
	return (
		<Head>
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta name='keywords' content={keywords} />
			<meta name='description' content={description} />
			<meta name='robots' content={robots} />
			<meta charSet='utf-8' />
			<meta
				property='og:image'
				content='https://cdn.discordapp.com/attachments/996874399863033856/1045693106529513522/midjourney3crop.png'
			/>
			<link rel='icon' href='/favicon.ico' />
			<title>{title}</title>
		</Head>
	);
};

export default Meta;
