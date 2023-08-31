import tailwindcssAnimate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.svelte"],
	theme: {
		extend: {},
		fontFamily: {
			sans: [...fontFamily.sans],
		},
	},
	plugins: [tailwindcssAnimate],
};
