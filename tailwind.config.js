const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	// The inline script in `layout.tsx` always resolves to an explicit
	// light/dark attribute, so the simple selector form is enough here.
	// Tailwind 3.3 predates the `["variant", ...]` form.
	darkMode: ["class", '[data-theme="dark"]'],

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
				// The prose theme for MDX bodies, driven off the paper
				// tokens so one theme serves manila and blueprint. This
				// replaces `prose-invert`, which was dark-locked.
				paper: {
					css: {
						"--tw-prose-body": "rgb(var(--graphite-soft))",
						"--tw-prose-headings": "rgb(var(--graphite))",
						"--tw-prose-lead": "rgb(var(--graphite-soft))",
						"--tw-prose-links": "rgb(var(--vermillion))",
						"--tw-prose-bold": "rgb(var(--graphite))",
						"--tw-prose-counters": "rgb(var(--graphite-faint))",
						"--tw-prose-bullets": "rgb(var(--vermillion) / .5)",
						"--tw-prose-hr": "rgb(var(--rule) / .15)",
						"--tw-prose-quotes": "rgb(var(--graphite-soft))",
						"--tw-prose-quote-borders": "rgb(var(--vermillion) / .45)",
						"--tw-prose-captions": "rgb(var(--graphite-faint))",
						"--tw-prose-code": "rgb(var(--graphite))",
						"--tw-prose-th-borders": "rgb(var(--rule) / .15)",
						"--tw-prose-td-borders": "rgb(var(--rule) / .15)",
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-geist)", ...defaultTheme.fontFamily.sans],
				mono: ["var(--font-jetbrains)", ...defaultTheme.fontFamily.mono],
				// The redesign's display face: drafted title-block lettering.
				title: ["var(--font-archivo)", ...defaultTheme.fontFamily.sans],
				// Margin annotations only. Budget: 4-6 instances sitewide.
				hand: ["var(--font-caveat)", "ui-rounded", "cursive"],
			},
			// Tailwind's default opacity scale jumps 10 -> 20, so `/12`,
			// `/15`, `/35` and `/45` generated NOTHING and every element
			// using one silently fell back to the default border colour,
			// Tailwind's gray-200. That is invisible on manila and a hard
			// white outline on blueprint, which is why the dark chips read
			// as drawn boxes while the light ones read as tone. Twenty
			// classes across nine files were dead. See the opacity-step
			// trap in CLAUDE.md.
			opacity: {
				12: "0.12",
				15: "0.15",
				35: "0.35",
				45: "0.45",
			},
			colors: {
				// --- Draughtsman's desk. Values live in global.css so one
				// set of recipes serves both paper stocks. ---
				desk: "rgb(var(--desk) / <alpha-value>)",
				"desk-2": "rgb(var(--desk-2) / <alpha-value>)",
				paper: "rgb(var(--paper) / <alpha-value>)",
				"paper-2": "rgb(var(--paper-2) / <alpha-value>)",
				kraft: "rgb(var(--kraft) / <alpha-value>)",
				"kraft-edge": "rgb(var(--kraft-edge) / <alpha-value>)",
				"kraft-ink": "rgb(var(--kraft-ink) / <alpha-value>)",
				graphite: "rgb(var(--graphite) / <alpha-value>)",
				"graphite-soft": "rgb(var(--graphite-soft) / <alpha-value>)",
				"graphite-faint": "rgb(var(--graphite-faint) / <alpha-value>)",
				vermillion: "rgb(var(--vermillion) / <alpha-value>)",
				rule: "rgb(var(--rule) / <alpha-value>)",

				// A chip sits ON the desk rather than being a sheet of
				// paper, so it gets its own two tones. They cannot just be
				// `paper` and `paper-2`: on manila `paper` is the lighter
				// of the pair, on blueprint it is the darker, so a chip
				// built from them is the brightest thing in the row in one
				// theme and the dimmest in the other. Defining the pair
				// per stock keeps "raised" meaning raised in both.
				chip: "rgb(var(--chip) / <alpha-value>)",
				"chip-raised": "rgb(var(--chip-raised) / <alpha-value>)",
			},
			borderColor: {
				// Derived from the rule token so a hairline is visible on
				// manila and on blueprint. The old hardcoded white alphas
				// were invisible on paper.
				line: "rgb(var(--rule) / .12)",
				"line-strong": "rgb(var(--rule) / .22)",
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
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
