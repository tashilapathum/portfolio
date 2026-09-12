// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";

function clsx(...args: any) {
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

const buildComponents = ({
	hideImage,
	hideHeading,
}: { hideImage?: string; hideHeading?: string }) => ({
	h1: ({ className, ...props }) => {
		if (
			hideHeading &&
			normalize(textOf(props.children)) === normalize(hideHeading)
		)
			return null;
		return (
			<h1
				className={clsx(
					"mt-2 scroll-m-20 font-display text-4xl font-normal tracking-tight",
					className,
				)}
				{...props}
			/>
		);
	},
	h2: ({ className, ...props }) => (
		<h2
			className={clsx(
				"mt-10 scroll-m-20 border-b border-b-white/10 pb-2 font-display text-3xl font-normal tracking-tight first:mt-0",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }) => (
		<h3
			className={clsx(
				"mt-8 scroll-m-20 font-display text-2xl font-normal tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }) => (
		<h4
			className={clsx(
				"mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }) => (
		<h5
			className={clsx(
				"mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }) => (
		<h6
			className={clsx(
				"mt-8 scroll-m-20 text-base font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }) => (
		<Link
			className={clsx(
				"font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:text-accent-soft",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, ...props }) => (
		<p
			className={clsx("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }) => (
		<ul className={clsx("my-6 ml-6 list-disc", className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol className={clsx("my-6 ml-6 list-decimal", className)} {...props} />
	),
	li: ({ className, ...props }) => (
		<li className={clsx("mt-2", className)} {...props} />
	),
	blockquote: ({ className, ...props }) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-2 border-accent/40 pl-6 italic text-fg [&>*]:text-muted",
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
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				className={clsx("rounded-xl border border-line", className)}
				alt={alt}
				{...props}
			/>
		);
	},
	hr: ({ ...props }) => (
		<hr className="my-4 border-white/10 md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="w-full my-6 overflow-y-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={clsx(
				"m-0 border-t border-white/10 p-0 even:bg-white/[.03]",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }) => (
		<th
			className={clsx(
				"border border-white/10 px-4 py-2 text-left font-semibold text-fg [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }) => (
		<td
			className={clsx(
				"border border-white/10 px-4 py-2 text-left text-muted [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }) => (
		<pre
			className={clsx(
				"mt-6 mb-4 overflow-x-auto rounded-xl border border-line bg-surface2 py-4",
				className,
			)}
			{...props}
		/>
	),
	code: ({ className, ...props }) => (
		<code
			className={clsx(
				"font-mono text-sm",
				!("data-language" in props) &&
					"relative rounded border border-line bg-white/[.06] py-[0.2rem] px-[0.3rem] text-accent-soft",
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
