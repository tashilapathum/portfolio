import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		mdxRs: true,
		// The OG card reads its two static fonts off disk. This is NOT
		// optional: the `[slug]` card routes are lambdas (Next 13.5 will
		// not prerender a metadata image route in a dynamic segment), so
		// they read the fonts at request time. Tracing does not follow a
		// `readFileSync` on its own, and without this they 500 in
		// production while working fine locally.
		outputFileTracingIncludes: {
			"/**/opengraph-image": ["./assets/og-fonts/**"],
		},
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "i.imgur.com" },
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
			{ protocol: "https", hostname: "media.giphy.com" },
			{ protocol: "https", hostname: "raw.githubusercontent.com" },
			{ protocol: "https", hostname: "github.com" },
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{ protocol: "https", hostname: "play-lh.googleusercontent.com" },
			{ protocol: "https", hostname: "www.payable.lk" },
		],
	},
};

export default withContentlayer(nextConfig);
