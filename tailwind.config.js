const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./mdx-components.tsx",
		"content/**/*.mdx",
	],

	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-geist)", ...defaultTheme.fontFamily.sans],
				display: ["var(--font-instrument)", "Georgia", "serif"],
				mono: ["var(--font-jetbrains)", ...defaultTheme.fontFamily.mono],
			},
			colors: {
				accent: "#0EA5E9",
				"accent-soft": "#7FD4F6",
				"accent-ink": "#07121a",
				ink: "#101215",
				surface: "#171A1D",
				surface2: "#15181B",
				fg: "#E8EBED",
				"fg-strong": "#F4F7F8",
				muted: "#8A9299",
				muted2: "#6F787F",
				muted3: "#4E565C",
			},
			borderColor: {
				line: "rgba(255,255,255,.07)",
				"line-strong": "rgba(255,255,255,.14)",
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
				hatch:
					"repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 7px, transparent 7px 14px)",
				"tile-accent": "linear-gradient(160deg, rgba(14,165,233,.14), #171A1D)",
			},
			boxShadow: {
				"accent-glow": "0 0 28px -8px rgba(14,165,233,.85)",
				"accent-tile": "0 0 26px -14px rgba(14,165,233,.9)",
				"accent-card": "0 0 50px -14px rgba(14,165,233,.6)",
			},
			animation: {
				"fade-in": "fade-in 1s ease-in-out forwards",
				"rise-in": "rise-in .45s cubic-bezier(.22,1,.36,1) both",
				"glow-pulse": "glow-pulse 9s ease-in-out infinite",
				float: "float 7s ease-in-out infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0%" },
					"100%": { opacity: "100%" },
				},
				"rise-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "none" },
				},
				"glow-pulse": {
					"0%, 100%": { opacity: ".35" },
					"50%": { opacity: ".9" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-9px)" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
	],
};
