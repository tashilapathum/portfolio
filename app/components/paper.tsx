import Image from "next/image";
import Link from "next/link";
import React from "react";
import { InkIn } from "./ink-in";

/* ------------------------------------------------------------------ *
 * The material primitives.
 *
 * Resting curl, hover and press are pure CSS, so every one of these
 * works inside a server component with no JS at all. framer-motion is
 * reserved for orchestrated moments (filter restagger, route change,
 * the nav sheet), not for the material itself.
 * ------------------------------------------------------------------ */

export type Stock = "bond" | "card" | "graph" | "pad" | "tracing";

const STOCK_CLASS: Record<Stock, string> = {
	bond: "stock-bond",
	card: "stock-card",
	graph: "stock-graph",
	pad: "stock-pad",
	tracing: "stock-tracing",
};

/**
 * A sheet of paper resting on the desk.
 *
 * `curl` is how far the corners lift, 0 to 2. Use 0 for anything that
 * should read as pinned flat (body copy, legal text) and 2 only for
 * things you could actually pick up.
 */
export function Paper({
	children,
	stock = "bond",
	curl = 1,
	tilt = 0,
	radius = "rounded-[3px]",
	className = "",
	sheetClassName = "",
}: {
	children: React.ReactNode;
	stock?: Stock;
	curl?: 0 | 1 | 2;
	/** Degrees of rotation. Small values only; paper lies almost flat. */
	tilt?: number;
	radius?: string;
	className?: string;
	sheetClassName?: string;
}) {
	// Paper has barely any corner radius. Rounded paper reads as plastic.
	return (
		<div
			// The level drives CSS variables from a stylesheet rule rather
			// than an inline style, so `:active` can override them and the
			// shadow actually animates on press.
			data-curl={curl}
			className={`paper ${className}`}
			style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
		>
			{curl > 0 && (
				<>
					<span aria-hidden="true" className="curl curl-l" />
					<span aria-hidden="true" className="curl curl-r" />
				</>
			)}
			<div
				className={`sheet ${STOCK_CLASS[stock]} ${radius} ${sheetClassName}`}
			>
				{children}
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * Cardboard: buttons and tabs. Real thickness, compresses on press.
 * ------------------------------------------------------------------ */
/**
 * Path data for the marks `Button` draws, on a 24x24 stroked grid. Kept
 * here so the two buttons in a pair share one weight and one geometry
 * instead of each page inlining its own SVG.
 */
export const ICON = {
	folder:
		"M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h9a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z",
	mail: "M3 6.75h18v10.5H3zM3.6 7.4l8.4 6 8.4-6",
	arrow: "M4 12h14M12.5 6.5 19 12l-6.5 5.5",
	download: "M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15",
} as const;

export function Button({
	href,
	children,
	variant = "primary",
	external = false,
	icon,
	className = "",
}: {
	href: string;
	children: React.ReactNode;
	variant?: "primary" | "quiet";
	external?: boolean;
	/** Path data for a 24x24 stroked mark, drawn at the label's left. */
	icon?: string;
	className?: string;
}) {
	const base =
		"cardboard inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[2px] px-6 py-3 text-sm font-semibold tracking-tight";
	const tone =
		variant === "primary"
			? "text-kraft-ink"
			: "bg-paper-2 text-graphite [--kraft-edge:var(--graphite-faint)]";

	const cls = `${base} ${tone} ${className}`;
	const isExternal =
		external || href.startsWith("http") || href.startsWith("mailto:");

	// Stroked, not filled: a solid glyph next to 14px semibold type reads
	// heavier than the label it belongs to.
	const label = (
		<>
			{icon && (
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.7}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-[16px] w-[16px] flex-none opacity-80"
				>
					<path d={icon} />
				</svg>
			)}
			{children}
		</>
	);

	if (isExternal) {
		return (
			<a
				href={href}
				target={href.startsWith("mailto:") ? undefined : "_blank"}
				rel="noopener noreferrer"
				className={cls}
			>
				{label}
			</a>
		);
	}
	return (
		<Link href={href} className={cls}>
			{label}
		</Link>
	);
}

/**
 * A kraft file-folder tab.
 *
 * The active tab is the same piece of card as the folder it opens: it
 * keeps the kraft face, drops its own bottom edge and sits 1px into the
 * folder's top edge, so the two read as one object. The inactive ones
 * are a lighter stock sitting slightly lower, which is what the tabs
 * behind the open folder actually do.
 *
 * Always render these inside a `<TabStrip>`. On their own there is no
 * folder for the active tab to flow into, and a tab attached to nothing
 * is just a chip.
 *
 * Pass `href` for navigation or `onClick` for filtering, never both.
 */
export function Tab({
	children,
	active = false,
	href,
	onClick,
	className = "",
}: {
	children: React.ReactNode;
	active?: boolean;
	href?: string;
	onClick?: () => void;
	className?: string;
}) {
	const cls = `cardboard rounded-t-[4px] rounded-b-none px-4 pb-2.5 pt-2 font-mono text-[11px] font-medium uppercase tracking-[.14em] transition-colors duration-200 ${
		active
			? "folder-tab-on text-kraft-ink"
			: "folder-tab-off bg-paper-2 text-graphite-faint hover:text-graphite [--kraft-edge:var(--graphite-faint)]"
	} ${className}`;

	if (href) {
		return (
			<Link
				href={href}
				aria-current={active ? "page" : undefined}
				className={cls}
			>
				{children}
			</Link>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={cls}
		>
			{children}
		</button>
	);
}

/**
 * The tab row plus the folder edge the active tab flows into.
 *
 * The row scrolls sideways rather than wrapping: a second row of folder
 * tabs is not a thing a folder has, and on a phone the categories would
 * otherwise wrap to two or three lines.
 */
export function TabStrip({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={className}>
			<div className="folder-tabs">{children}</div>
			<div aria-hidden="true" className="folder-edge" />
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * Mounted photography.
 * ------------------------------------------------------------------ */

/** A torn strip of tape. Position with the usual inset utilities. */
export function Tape({
	className = "",
	tilt = -4,
}: {
	className?: string;
	tilt?: number;
}) {
	return (
		<span
			aria-hidden="true"
			className={`tape ${className}`}
			style={{ transform: `rotate(${tilt}deg)` }}
		/>
	);
}

/**
 * Four torn strips, one across each corner.
 *
 * The class names are spelled out rather than built by interpolation:
 * Tailwind tree-shakes `@layer components` against the source text, so
 * a `tape-corner-${c}` template would compile to nothing.
 */
export function CornerTape() {
	// Smaller strips on a phone, where the print itself is smaller.
	const size = "h-[17px] w-[54px] sm:h-[22px] sm:w-[74px]";
	return (
		<>
			<span
				aria-hidden="true"
				className={`tape tape-corner tape-corner-tl ${size}`}
			/>
			<span
				aria-hidden="true"
				className={`tape tape-corner tape-corner-tr ${size}`}
			/>
			<span
				aria-hidden="true"
				className={`tape tape-corner tape-corner-bl ${size}`}
			/>
			<span
				aria-hidden="true"
				className={`tape tape-corner tape-corner-br ${size}`}
			/>
		</>
	);
}

export function PhotoCorners() {
	return (
		<>
			<span aria-hidden="true" className="photo-corner photo-corner-tl" />
			<span aria-hidden="true" className="photo-corner photo-corner-tr" />
			<span aria-hidden="true" className="photo-corner photo-corner-bl" />
			<span aria-hidden="true" className="photo-corner photo-corner-br" />
		</>
	);
}

/**
 * A photographic print, mounted to the page.
 *
 * The white border is doing real work beyond decoration: the project
 * covers are saturated store banners, and the mount separates them from
 * the blueprint substrate in dark mode instead of letting them clash.
 */
export function Photo({
	src,
	alt,
	mount = "tape",
	fit = "cover",
	aspect = "aspect-[4/3]",
	tilt = 0,
	className = "",
	sizes = "(min-width: 1024px) 420px, 100vw",
	priority = false,
}: {
	src: string;
	alt: string;
	mount?: "tape" | "corners" | "photo-corners" | "none";
	fit?: "cover" | "contain";
	/**
	 * The print's own proportions. A Tailwind aspect utility rather
	 * than a number, so it can vary by breakpoint: a wide store banner
	 * that reads fine on a desktop row wants to be squarer on a phone.
	 */
	aspect?: string;
	tilt?: number;
	className?: string;
	sizes?: string;
	priority?: boolean;
}) {
	return (
		<div
			className={`relative ${className}`}
			style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
		>
			<Paper curl={mount === "none" ? 1 : 2} radius="rounded-[2px]">
				<div className="p-2 pb-6 sm:p-2.5 sm:pb-7">
					<div className={`relative overflow-hidden bg-desk-2 ${aspect}`}>
						<Image
							src={src}
							alt={alt}
							fill
							sizes={sizes}
							priority={priority}
							unoptimized={src.endsWith(".svg")}
							className={
								fit === "contain" ? "object-contain p-3" : "object-cover"
							}
						/>
					</div>
				</div>
			</Paper>

			{mount === "tape" && <CornerTape />}
			{mount === "corners" && (
				<>
					<Tape
						className="-top-2.5 left-4 h-5 w-16 sm:-top-3 sm:left-5 sm:h-7 sm:w-20"
						tilt={-6}
					/>
					<Tape
						className="-top-2 right-5 h-5 w-14 sm:-top-2.5 sm:right-6 sm:h-7 sm:w-16"
						tilt={5}
					/>
				</>
			)}
			{mount === "photo-corners" && <PhotoCorners />}
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * IndexCard: a catalogue entry, not a fallback.
 *
 * Most projects have no artwork and no case-study frontmatter. A typed
 * card is a legitimate entry for those, where a hatched "missing image"
 * placeholder just looks broken.
 * ------------------------------------------------------------------ */
export function IndexCard({
	title,
	meta,
	children,
	className = "",
	tilt = 0,
}: {
	title: string;
	meta?: string;
	children?: React.ReactNode;
	className?: string;
	tilt?: number;
}) {
	return (
		<Paper stock="card" curl={1} tilt={tilt} className={className}>
			<div className="relative p-5">
				{/* The ruled head of a real index card. */}
				<span
					aria-hidden="true"
					className="absolute inset-x-0 top-9 h-px bg-vermillion/25"
				/>
				<h3 className="m-0 font-title text-[19px] font-extrabold uppercase leading-none tracking-[-.02em] text-graphite">
					{title}
				</h3>
				{meta && (
					<div className="mt-3.5 font-mono text-[10.5px] uppercase tracking-[.14em] text-graphite-faint">
						{meta}
					</div>
				)}
				{children && (
					<div className="mt-2.5 text-[13.5px] leading-relaxed text-graphite-soft">
						{children}
					</div>
				)}
			</div>
		</Paper>
	);
}

/* ------------------------------------------------------------------ *
 * Annotation: the handwritten margin note.
 *
 * BUDGET: 4 to 6 across the entire site. Every one must be an aside
 * worth reading. The moment these become decoration the whole design
 * reads as twee, so if you are adding a seventh, delete one instead.
 * ------------------------------------------------------------------ */
export function Annotation({
	children,
	className = "",
	tilt = -2,
	write = true,
}: {
	children: React.ReactNode;
	className?: string;
	tilt?: number;
	/**
	 * Wipe the note on when it scrolls into view, as if it were being
	 * written. On by default: the whole point of the red pen is that
	 * someone picked it up. Pass `false` where the note is already in
	 * the first viewport and the wipe would fire before anyone looks.
	 */
	write?: boolean;
}) {
	return (
		<p
			className={`m-0 font-hand text-[19px] leading-snug text-vermillion ${className}`}
			style={{ transform: `rotate(${tilt}deg)` }}
		>
			{write ? <InkIn>{children}</InkIn> : children}
		</p>
	);
}

/* ------------------------------------------------------------------ *
 * Structure.
 * ------------------------------------------------------------------ */

/**
 * The content column every route sits in.
 *
 * One definition so the nav's folder edge, the page body and the title
 * block all line up on the same margins. Change it here or they drift.
 */
export function Main({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<main
			className={`mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-10 ${className}`}
		>
			{children}
		</main>
	);
}

/** A hairline rule. The quiet alternative to boxing something in a card. */
export function Rule({ className = "" }: { className?: string }) {
	return (
		<hr
			className={`m-0 h-px border-0 bg-rule/15 ${className}`}
			aria-hidden="true"
		/>
	);
}

/**
 * A section header: title, an optional aside, and a rule running out to
 * the right margin.
 *
 * No section number. `DESIGN.md` §4 is explicit that `01 / INDEX`
 * breadcrumbs are out, and the eyebrow budget is one per three
 * sections, so the title carries the section on its own.
 */
export function SectionHead({
	title,
	note,
	as = "h2",
	className = "",
}: {
	title: string;
	note?: string;
	as?: "h2" | "h3";
	className?: string;
}) {
	return (
		<div
			className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${className}`}
		>
			<Title as={as} className="text-[21px] sm:text-[26px]">
				{title}
			</Title>
			{note && <span className="text-[13px] text-graphite-faint">{note}</span>}
			<span aria-hidden="true" className="h-px flex-1 bg-rule/15" />
		</div>
	);
}

/* ------------------------------------------------------------------ *
 * Typographic helpers.
 * ------------------------------------------------------------------ */

/** A drafted structural header. */
export function Title({
	children,
	as: Tag = "h2",
	className = "",
}: {
	children: React.ReactNode;
	as?: "h1" | "h2" | "h3";
	className?: string;
}) {
	return (
		<Tag
			className={`m-0 font-title font-extrabold uppercase leading-[.9] tracking-[-.03em] text-graphite ${className}`}
		>
			{children}
		</Tag>
	);
}

/** Small technical label. Rationed: see the eyebrow budget in the plan. */
export function Label({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[.2em] text-graphite-faint ${className}`}
		>
			{children}
		</div>
	);
}
