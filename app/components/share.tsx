"use client";
import { useState } from "react";
import {
	FacebookShareButton,
	LinkedinShareButton,
	RedditShareButton,
} from "react-share";

/**
 * The share sheet, on tracing paper.
 *
 * Word marks rather than the `react-share` colour icons: three
 * saturated brand circles are the one thing on this site that would not
 * belong on a drawing, and dropping them takes three vendor icon
 * components out of the bundle with them.
 *
 * `"use client"` is load-bearing. This has always used `useState` and
 * only worked because both callers happened to be client components.
 */
export default function ShareSheet({
	url,
	className = "",
}: {
	url: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const item =
		"block w-full px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[.16em] text-graphite-soft transition-colors duration-200 hover:text-vermillion";

	return (
		<div
			className={`stock-tracing w-[190px] rounded-[3px] border border-rule/20 py-1.5 shadow-[0_14px_30px_-14px_rgb(var(--shadow-rgb)/.5)] ${className}`}
		>
			<LinkedinShareButton url={url} className={item} resetButtonStyle={false}>
				LinkedIn
			</LinkedinShareButton>
			<FacebookShareButton url={url} className={item} resetButtonStyle={false}>
				Facebook
			</FacebookShareButton>
			<RedditShareButton url={url} className={item} resetButtonStyle={false}>
				Reddit
			</RedditShareButton>

			<button
				type="button"
				className={item}
				onClick={() => {
					navigator.clipboard.writeText(url).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					});
				}}
			>
				{copied ? "Copied" : "Copy link"}
			</button>
		</div>
	);
}
