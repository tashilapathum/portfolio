import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/server";
import { SITE } from "./site";

/**
 * The social card: a drafting sheet on the desk.
 *
 * Satori is not a browser. Three constraints shape everything below:
 *
 * 1. **No CSS custom properties.** `var(--paper)` resolves to nothing,
 *    so every colour here is a literal hex copied from the light stock
 *    in `global.css`. If those tokens change, these change with them.
 * 2. **Flexbox only, and `display: flex` must be explicit** on every
 *    element with more than one child. There is no grid, and no
 *    block-layout fallback.
 * 3. **Static fonts only.** The bundled opentype.js parses the `fvar`
 *    axis table but never `gvar`, so a variable font renders at its
 *    default instance and every weight comes out Regular. It also has
 *    no woff2 support. Hence the two `.ttf` files next door.
 */

const INK = "#1C1B18";
const FAINT = "#6A645A";
const SOFT = "#545048";
const PAPER = "#F5F1E8";
const DESK = "#DFD6C5";
const VERMILLION = "#BE3E2A";
const RULE = "rgba(28,27,24,0.14)";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Read off disk, not through `fetch(new URL(..., import.meta.url))`.
 *
 * That documented pattern only works on the edge runtime. Metadata
 * routes default to node, where webpack still emits the asset but
 * `import.meta.url` resolves to a ROOT-RELATIVE path
 * (`/_next/static/media/Archivo-…ttf`), and node's `fetch` throws
 * `ERR_INVALID_URL` on it. Every OG route 500s.
 *
 * The five static routes prerender their card at build time. The two
 * dynamic ones do NOT: Next 13.5 marks a metadata image route in a
 * dynamic segment as a lambda whatever you do, and `force-static` on it
 * changes nothing. So those two read these files at REQUEST time, which
 * is exactly why `next.config.mjs` traces this directory. Without that
 * include they would 500 in production only.
 *
 * Read once at module scope: seven routes would otherwise re-read the
 * same 236KB on every card.
 */
const fontDir = join(process.cwd(), "assets", "og-fonts");

const fonts = [
	{
		name: "Archivo",
		data: readFileSync(join(fontDir, "Archivo-ExtraBold.ttf")),
		weight: 800 as const,
		style: "normal" as const,
	},
	{
		name: "JetBrains Mono",
		data: readFileSync(join(fontDir, "JetBrainsMono-Regular.ttf")),
		weight: 400 as const,
		style: "normal" as const,
	},
];

/** One field of the title block. */
function Field({ label, value }: { label: string; value: string }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "14px 22px",
				backgroundColor: PAPER,
				flexGrow: 1,
			}}
		>
			<div
				style={{
					fontFamily: "JetBrains Mono",
					fontSize: 15,
					letterSpacing: 3,
					textTransform: "uppercase",
					color: FAINT,
				}}
			>
				{label}
			</div>
			<div
				style={{
					fontFamily: "JetBrains Mono",
					fontSize: 21,
					color: INK,
					marginTop: 6,
				}}
			>
				{value}
			</div>
		</div>
	);
}

export async function ogSheet({
	title,
	kicker,
	sheet,
	note,
}: {
	/** The headline. Kept short: it sets at 76px and gets three lines. */
	title: string;
	/** The small mono line above it. */
	kicker: string;
	/** What this sheet is, for the title block. */
	sheet: string;
	/**
	 * A line under the headline. Optional, and worth passing whenever
	 * the title is short: a two-word title alone leaves the middle of
	 * the card empty, which reads as a template with a hole in it.
	 * Truncated rather than wrapped past two lines, since the title
	 * block needs the foot of the sheet.
	 */
	note?: string;
}) {
	const revision = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
	}).format(new Date());

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				padding: 40,
				backgroundColor: DESK,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: PAPER,
					position: "relative",
					padding: "56px 64px 0 96px",
				}}
			>
				{/* The drafting margin: one red-pen rule down the left edge. */}
				<div
					style={{
						position: "absolute",
						left: 56,
						top: 0,
						bottom: 0,
						width: 2,
						backgroundColor: "rgba(190,62,42,0.3)",
					}}
				/>

				<div
					style={{
						fontFamily: "JetBrains Mono",
						fontSize: 19,
						letterSpacing: 5,
						textTransform: "uppercase",
						color: VERMILLION,
					}}
				>
					{kicker}
				</div>

				<div
					style={{
						fontFamily: "Archivo",
						fontSize: 76,
						lineHeight: 1.04,
						letterSpacing: -2,
						textTransform: "uppercase",
						color: INK,
						marginTop: 30,
						// Leaves room for the title block: three lines at most.
						maxWidth: 940,
					}}
				>
					{title}
				</div>

				{note && (
					<div
						style={{
							fontFamily: "JetBrains Mono",
							fontSize: 25,
							lineHeight: 1.5,
							color: SOFT,
							marginTop: 28,
							maxWidth: 820,
						}}
					>
						{note.length > 110 ? `${note.slice(0, 107).trimEnd()}...` : note}
					</div>
				)}

				{/* Title block, pinned to the foot of the sheet. The 1px gaps
				    over a rule-coloured ground draw the hairlines, so
				    neighbours never stack two borders. */}
				<div
					style={{
						display: "flex",
						marginTop: "auto",
						marginBottom: 48,
						backgroundColor: RULE,
						border: `1px solid ${RULE}`,
						gap: 1,
					}}
				>
					<Field label="Drawn by" value={SITE.name} />
					<Field label="Sheet" value={sheet} />
					<Field label="Scale" value="1:1" />
					<Field label="Rev" value={revision} />
				</div>
			</div>
		</div>,
		{ ...OG_SIZE, fonts },
	);
}
