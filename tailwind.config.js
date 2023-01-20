/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: [
		"./pages/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./HOC/*.{js,jsx,ts,tsx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				main: {
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
				},
			},
			keyframes: {
				fadeIn: {
					from: {
						opacity: 0,
						transform: "scale(.80)",
					},
				},
				fadeOut: {
					to: {
						opacity: 0,
						transform: "scale(.80)",
					},
				},
				rotate_ac: {
					"0%": { transform: "rotate(360deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
			},
			animation: {
				"spin-ac": "rotate_ac 2s linear infinite",
				fadeIn: "fadeIn 0.1s ease-out",
				fadeOut: "fadeOut 0.15s ease-out forwards",
			},
		},
		screens: {
			xs: "420px",
			...defaultTheme.screens,
		},
		fontFamily: {
			comic: ['"Comic Sans MS"', '"Comic Sans"', "cursive"],
		},
	},
	plugins: [require("@headlessui/tailwindcss")],
};
