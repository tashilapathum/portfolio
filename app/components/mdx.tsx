import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";

/**
 * The MDX component map, on tokens.
 *
 * Nothing in here may use a raw colour. The old map was built out of
 * `border-white/10` and `bg-white/[.03]`, which is invisible on manila
 * and was the single largest surface that broke when the site moved off
 * the dark stock. Every rule now comes from `--rule` and every ink from
 * the graphite ramp, so one map serves both papers.
 */

function clsx(...args: (string | false | null | undefined)[]) {
	return args.filter(Boolean).join(" ");
}

/** Emoji, punctuation and casing stripped, so "NeoMusic 🎵" matches "NeoMusic". */
function normalize(value: string) {
	return value.replace(/[^\p{Letter}\p{Number}]+/gu, "").toLowerCase();
}

function textOf(node: React.ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return textOf(
		(node as { props?: { children?: React.ReactNode } })?.props?.children,
	);
}

type Styled<T> = T & { className?: string; children?: React.ReactNode };

const HEADING =
	"scroll-m-20 font-title font-extrabold uppercase tracking-[-.02em] text-graphite";

const buildComponents = ({
	hideImage,
	hideHeading,
}: { hideImage?: string; hideHeading?: string }) => ({
	h1: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => {
		if (
			hideHeading &&
			normalize(textOf(props.children)) === normalize(hideHeading)
		)
			return null;
		return (
			<h1
				className={clsx("mt-2 text-[32px] leading-[.95]", HEADING, className)}
				{...props}
			/>
		);
	},
	h2: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<h2
			className={clsx(
				"mt-12 border-b border-rule/15 pb-2.5 text-[25px] leading-none first:mt-0",
				HEADING,
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<h3
			className={clsx("mt-9 text-[19px] leading-none", HEADING, className)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<h4
			className={clsx(
				"mt-8 font-mono text-[11px] uppercase tracking-[.2em] text-graphite-faint",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<h5
			className={clsx(
				"mt-8 text-[15px] font-semibold tracking-tight text-graphite",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<h6
			className={clsx(
				"mt-8 text-[14px] font-semibold tracking-tight text-graphite",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }: Styled<{ href?: string }>) => (
		<Link
			href={props.href ?? "#"}
			className={clsx(
				"font-medium text-vermillion underline decoration-vermillion/35 underline-offset-4 transition-colors duration-200 hover:decoration-vermillion",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<p
			className={clsx(
				"leading-7 text-graphite-soft [&:not(:first-child)]:mt-6",
				className,
			)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<ul
			className={clsx("my-6 ml-6 list-disc text-graphite-soft", className)}
			{...props}
		/>
	),
	ol: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<ol
			className={clsx("my-6 ml-6 list-decimal text-graphite-soft", className)}
			{...props}
		/>
	),
	li: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<li className={clsx("mt-2", className)} {...props} />
	),
	blockquote: ({
		className,
		...props
	}: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-2 border-vermillion/45 pl-6 italic text-graphite-soft",
				className,
			)}
			{...props}
		/>
	),
	img: ({
		className,
		alt,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement>) => {
		if (hideImage && props.src === hideImage) return null;
		// A print, mounted: the paper border is what stops a saturated
		// store banner clashing with the stock it sits on.
		return (
			// eslint-disable-next-line @next/next/no-img-element
			// rome-ignore lint/a11y/useAltText: alt is forwarded from the MDX source
			<img
				className={clsx(
					"rounded-[2px] border-[6px] border-paper bg-desk-2 shadow-[0_10px_22px_-12px_rgb(var(--shadow-rgb)/.5)]",
					className,
				)}
				alt={alt}
				{...props}
			/>
		);
	},
	hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
		<hr className="my-8 border-rule/15" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-x-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={clsx(
				"m-0 border-t border-rule/15 p-0 even:bg-rule/[.04]",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<th
			className={clsx(
				"border border-rule/15 px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[.14em] text-graphite-faint [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<td
			className={clsx(
				"border border-rule/15 px-4 py-2 text-left text-graphite-soft [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<pre
			className={clsx(
				"mb-4 mt-6 overflow-x-auto rounded-[3px] border border-rule/15 bg-desk-2 py-4",
				className,
			)}
			{...props}
		/>
	),
	code: ({
		className,
		...props
	}: Styled<React.HTMLAttributes<HTMLElement>>) => (
		<code
			className={clsx(
				"font-mono text-[13px]",
				!("data-language" in props) &&
					"relative rounded-[2px] border border-rule/15 bg-rule/[.06] px-[.3rem] py-[.15rem] text-graphite",
				className,
			)}
			{...props}
		/>
	),
	Image,
});

interface MdxProps {
	code: string;
	/** Hide an image the surrounding page already renders as its hero. */
	hideImage?: string;
	/** Hide a heading that just repeats the page title. */
	hideHeading?: string;
}

export function Mdx({ code, hideImage, hideHeading }: MdxProps) {
	const Component = useMDXComponent(code);
	const components = buildComponents({ hideImage, hideHeading });

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
