"use client";
import { Share2 } from "lucide-react";
import React, { useState } from "react";
import ShareSheet from "@/app/components/share";
import { Eyebrow } from "@/app/components/ui";

type Props = {
	post: {
		title: string;
		description: string;
		formattedDate: string;
		readingTime: number;
	};
};

export const Header: React.FC<Props> = ({ post }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative pb-8 pt-11">
			<div className="flex items-start justify-between gap-6">
				<Eyebrow tone="muted">
					<a
						href="/blog"
						className="transition-colors duration-200 hover:text-fg"
					>
						&larr; Blog
					</a>
				</Eyebrow>

				<div className="relative">
					<button
						type="button"
						aria-label="Share"
						onClick={() => setIsOpen((o) => !o)}
						className="text-muted2 transition-colors duration-200 hover:text-fg"
					>
						<Share2 className="h-5 w-5" />
					</button>
					{isOpen && (
						<div className="absolute right-0 top-full z-40 mt-2">
							<ShareSheet url={window.location.href} />
						</div>
					)}
				</div>
			</div>

			<h1 className="mt-5 font-display text-4xl leading-[1.02] text-white sm:text-5xl lg:text-[56px]">
				{post.title}
			</h1>
			<p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted">
				{post.description}
			</p>
			<div className="mt-5 flex gap-5 font-mono text-[11px] uppercase tracking-[.14em] text-muted2">
				<span>{post.formattedDate}</span>
				<span>{post.readingTime} min read</span>
			</div>
		</div>
	);
};
