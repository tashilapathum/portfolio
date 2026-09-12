import "../global.css";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { PageTransition } from "./components/page-transition";

export const metadata: Metadata = {
	metadataBase: new URL("https://tashila.me"),
	title: {
		default: "Tashila Pathum — Senior Software Engineer",
		template: "%s | tashila.me",
	},
	description:
		"Native Android engineer. Seven years of Kotlin, Compose and Flutter — 15+ apps shipped to 200k+ users.",
	openGraph: {
		title: "Tashila Pathum — Senior Software Engineer",
		description:
			"Native Android engineer. Seven years of Kotlin, Compose and Flutter — 15+ apps shipped to 200k+ users.",
		url: "https://tashila.me",
		siteName: "tashila.me",
		images: [
			{
				url: "https://tashila.me/og.png",
				width: 1920,
				height: 1080,
			},
		],
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

const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
	variable: "--font-instrument",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-jetbrains",
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={[
				geist.variable,
				instrumentSerif.variable,
				jetbrainsMono.variable,
			].join(" ")}
		>
			<head>
				<Analytics />
			</head>
			<body
				className={`bg-ink text-fg font-sans antialiased ${
					process.env.NODE_ENV === "development" ? "debug-screens" : ""
				}`}
			>
				<PageTransition>{children}</PageTransition>
			</body>
		</html>
	);
}
