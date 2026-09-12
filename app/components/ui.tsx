import Link from "next/link";
import React from "react";

/* ------------------------------------------------------------------ *
 * Glow — the cinematic radial wash used behind heroes and headers.
 * ------------------------------------------------------------------ */
const GLOW_RGB = {
	accent: "14, 165, 233",
	// Sampled off the NeoMusic player screen, so its halo reads as light
	// coming off the device rather than the site accent.
	crimson: "234, 51, 59",
};

export function Glow({
	className = "",
	strength = 0.26,
	pulse = false,
	tone = "accent",
}: {
	className?: string;
	strength?: number;
	pulse?: boolean;
	tone?: keyof typeof GLOW_RGB;
}) {
	return (
		<div
			aria-hidden="true"
			className={`glow absolute ${
				pulse ? "animate-glow-pulse" : ""
			} ${className}`}
			style={{
				["--glow-strength" as string]: strength,
				["--glow-rgb" as string]: GLOW_RGB[tone],
			}}
		/>
	);
}

/* ------------------------------------------------------------------ *
 * Button — filled (primary) or outlined (ghost). A real action.
 * ------------------------------------------------------------------ */
type ButtonProps = {
	href: string;
	children: React.ReactNode;
	variant?: "primary" | "ghost";
	external?: boolean;
	className?: string;
};

export function Button({
	href,
	children,
	variant = "primary",
	external = false,
	className = "",
}: ButtonProps) {
	const base =
		"inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3.5 text-sm transition-colors duration-200";
	const styles =
		variant === "primary"
			? "bg-accent text-accent-ink font-semibold shadow-accent-glow hover:bg-accent-soft"
			: "bg-white/5 border border-line-strong text-fg font-medium hover:bg-white/10";
	const cls = `${base} ${styles} ${className}`;

	if (external || href.startsWith("http") || href.startsWith("mailto:")) {
		return (
			<a
				href={href}
				target={href.startsWith("mailto:") ? undefined : "_blank"}
				rel="noopener noreferrer"
				className={cls}
			>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={cls}>
			{children}
		</Link>
	);
}

/* ------------------------------------------------------------------ *
 * TextLink — accent, underlined, trailing arrow. Never a button.
 * ------------------------------------------------------------------ */
export function TextLink({
	href,
	children,
	tone = "accent",
	external = false,
	className = "",
}: {
	href: string;
	children: React.ReactNode;
	tone?: "accent" | "muted";
	external?: boolean;
	className?: string;
}) {
	const cls = `group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium underline underline-offset-4 transition-colors duration-200 ${
		tone === "accent"
			? "text-accent decoration-accent/45 hover:text-accent-soft"
			: "text-muted decoration-white/20 hover:text-fg"
	} ${className}`;

	const inner = (
		<>
			{children}
			<span
				aria-hidden="true"
				className="no-underline transition-transform duration-200 group-hover:translate-x-0.5"
			>
				&rarr;
			</span>
		</>
	);

	if (external || href.startsWith("http") || href.startsWith("mailto:")) {
		return (
			<a
				href={href}
				target={href.startsWith("mailto:") ? undefined : "_blank"}
				rel="noopener noreferrer"
				className={cls}
			>
				{inner}
			</a>
		);
	}
	return (
		<Link href={href} className={cls}>
			{inner}
		</Link>
	);
}

/* ------------------------------------------------------------------ *
 * Eyebrow / SectionHead — mono-caps labelling.
 * ------------------------------------------------------------------ */
export function Eyebrow({
	children,
	tone = "accent",
	className = "",
}: {
	children: React.ReactNode;
	tone?: "accent" | "muted";
	className?: string;
}) {
	return (
		<div
			className={`font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[.2em] ${
				tone === "accent" ? "text-accent" : "text-muted2"
			} ${className}`}
		>
			{children}
		</div>
	);
}

export function SectionHead({
	index,
	title,
	className = "",
}: {
	index?: string;
	title: string;
	className?: string;
}) {
	return (
		<div className={`flex items-baseline gap-4 ${className}`}>
			{index && (
				<span className="font-mono text-[11px] font-medium uppercase tracking-[.2em] text-accent">
					{index}
				</span>
			)}
			<h2 className="m-0 font-display text-3xl leading-none text-fg-strong sm:text-4xl">
				{title}
			</h2>
			<span aria-hidden="true" className="h-px flex-1 bg-white/10" />
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * PlaceholderTile — diagonal hatch, stands in for a missing image.
 * ------------------------------------------------------------------ */
export function PlaceholderTile({
	label,
	className = "",
	accent = false,
}: {
	label: string;
	className?: string;
	accent?: boolean;
}) {
	return (
		<div
			className={`flex items-center justify-center bg-hatch p-3 text-center ${
				accent ? "border border-accent/35" : "border border-white/10"
			} ${className}`}
		>
			<span className="font-mono text-[9.5px] font-medium uppercase leading-relaxed tracking-[.12em] text-muted2">
				{label}
			</span>
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * Rule — the mono-caps divider used for "Load more".
 * ------------------------------------------------------------------ */
export function RuleLabel({ children }: { children: React.ReactNode }) {
	return (
		<span className="flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[.2em] text-muted">
			<span aria-hidden="true" className="h-px w-7 bg-white/20" />
			{children}
			<span aria-hidden="true" className="h-px w-7 bg-white/20" />
		</span>
	);
}
