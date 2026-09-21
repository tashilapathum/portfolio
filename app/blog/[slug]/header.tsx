"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShareSheet from "@/app/components/share";
import { Title } from "@/app/components/paper";

type Props = {
	post: {
		title: string;
		description: string;
		formattedDate: string;
		readingTime: number;
	};
};

export function Header({ post }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState("");

	// Read the location after mount rather than during render, so this
	// stays safe if the share sheet ever renders before a click.
	useEffect(() => setUrl(window.location.href), []);

	return (
		<div className="relative pb-9">
			<div className="flex items-start justify-between gap-6">
				<Link
					href="/blog"
					className="font-mono text-[10.5px] uppercase tracking-[.2em] text-graphite-faint transition-colors duration-200 hover:text-vermillion"
				>
					&larr; Blog
				</Link>

				<div className="relative">
					<button
						type="button"
						aria-expanded={isOpen}
						onClick={() => setIsOpen((o) => !o)}
						className="font-mono text-[10.5px] uppercase tracking-[.2em] text-graphite-faint transition-colors duration-200 hover:text-vermillion"
					>
						Share
					</button>
					{isOpen && (
						<div className="absolute right-0 top-full z-40 mt-2">
							<ShareSheet url={url} />
						</div>
					)}
				</div>
			</div>

			<Title as="h1" className="mt-6 text-[34px] sm:text-[44px] lg:text-[54px]">
				{post.title}
			</Title>
			<p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-graphite-soft">
				{post.description}
			</p>
			<div className="mt-5 flex gap-5 font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint">
				<span>{post.formattedDate}</span>
				<span>{post.readingTime} min read</span>
			</div>
		</div>
	);
}
