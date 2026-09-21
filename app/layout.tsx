import "../global.css";
import { Archivo, Caveat, JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { PageTransition } from "./components/page-transition";
import { LightSource } from "./components/light-source";
import { SiteNav } from "./components/site-nav";
import { TitleBlock } from "./components/title-block";

export const metadata: Metadata = {
	metadataBase: new URL("https://tashila.me"),
	title: {
		default: "Tashila Pathum, Senior Software Engineer",
		template: "%s | tashila.me",
	},
	description:
		"Native Android engineer. Seven years of Kotlin, Compose and Flutter. 15+ apps shipped to 200k+ users.",
	openGraph: {
		title: "Tashila Pathum, Senior Software Engineer",
		description:
			"Native Android engineer. Seven years of Kotlin, Compose and Flutter. 15+ apps shipped to 200k+ users.",
		url: "https://tashila.me",
		siteName: "tashila.me",
		// No `images` here. Every route ships its own drafting-sheet card
		// from an `opengraph-image.tsx`, and a default listed at this level
		// would win over them.
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Tashila",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "/favicon.png",
	},
};

// Geist is not in Next 13's Google Fonts catalogue, so it is self-hosted.
// Single variable file covering 300–700.
const geist = LocalFont({
	src: [
		{
			path: "../public/fonts/Geist-latin.woff2",
			weight: "300 700",
			style: "normal",
		},
	],
	variable: "--font-geist",
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-jetbrains",
	display: "swap",
});

// Both are variable fonts, so omitting `weight` ships one file per family
// rather than one per weight.
const archivo = Archivo({
	subsets: ["latin"],
	variable: "--font-archivo",
	display: "swap",
});

const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-caveat",
	display: "swap",
});

/**
 * Resolves the paper stock before first paint, so the page never flashes
 * the wrong one. An absent `theme` key means "follow the system", which is
 * why this writes an explicit attribute rather than leaving it off.
 */
const THEME_SCRIPT = `(function(){var d=document.documentElement;var t;try{
var s=localStorage.getItem("theme");t=(s==="dark"||s==="light")?s:
(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");}
catch(e){t="light";}d.dataset.theme=t;d.style.colorScheme=t;})();`;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={[
				geist.variable,
				jetbrainsMono.variable,
				archivo.variable,
				caveat.variable,
			].join(" ")}
		>
			<head>
				{/*
				 * Declares that the page handles both schemes itself, so the
				 * UA styles scrollbars and form controls to match the chosen
				 * stock instead of guessing from the OS. It also opts out of
				 * Chrome's auto-dark-mode heuristic, though not from the
				 * force-dark flag, which overrides author intent outright
				 * and cannot be defeated from the page.
				 */}
				<meta name="color-scheme" content="light dark" />
				{/* Must run before paint. */}
				<script
					// The content is a module-level constant with no
					// interpolation, and it must run before hydration.
					// rome-ignore lint/security/noDangerouslySetInnerHtml: runs pre-paint by design
					dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
				/>
				<Analytics />
			</head>
			{/*
			 * The desk is painted here rather than on `body` so both paper
			 * stocks work off the tokens with no `dark:` variant anywhere.
			 *
			 * The horizontal clip is load-bearing: `Paper`'s tilt and every
			 * `Tape` strip deliberately overhang their box, and without it a
			 * phone scrolls sideways on every page. It must be `clip` and
			 * not `hidden`: `overflow-x: hidden` computes the other axis to
			 * `auto`, which turns body into a scroll container and silently
			 * kills `position: sticky` for the nav and every case-study
			 * sidebar. `clip` creates no scroll container.
			 */}
			<body
				className={`desk grain min-h-[100dvh] overflow-x-clip font-sans text-graphite antialiased ${
					process.env.NODE_ENV === "development" ? "debug-screens" : ""
				}`}
			>
				<LightSource />
				<SiteNav />
				<PageTransition>{children}</PageTransition>
				<TitleBlock />
			</body>
		</html>
	);
}
