"use client";
import { Share2 } from "lucide-react";
import React, { useState } from "react";
import ShareSheet from "@/app/components/share";
import { Button, Eyebrow, TextLink } from "@/app/components/ui";

type Props = {
	project: {
		slug: string;
		url?: string;
		title: string;
		description?: string;
		tagline?: string;
		repository?: string;
	};
	rank?: number;
	/** Extra link shown as a text link, e.g. a project landing page. */
	site?: string;
};

export const Header: React.FC<Props> = ({ project, rank, site }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative pb-9 pt-11">
			<div className="flex items-start justify-between gap-6">
				<Eyebrow tone="muted">
					<a
						href="/projects"
						className="transition-colors duration-200 hover:text-fg"
					>
						&larr; Projects
					</a>
					{rank ? ` / ${String(rank).padStart(2, "0")}` : ""}
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

			<h1 className="mt-5 font-display text-5xl leading-[.98] text-white sm:text-6xl lg:text-[76px]">
				{project.title}
			</h1>
			<p className="mt-4 max-w-[620px] text-[17.5px] leading-relaxed text-muted">
				{project.tagline ?? project.description}
			</p>

			<div className="mt-7 flex flex-wrap items-center gap-3">
				{project.repository && (
					<Button href={`https://github.com/${project.repository}`} external>
						View source
					</Button>
				)}
				{project.url && (
					<Button
						href={project.url}
						variant={project.repository ? "ghost" : "primary"}
						external
					>
						Play Store
					</Button>
				)}
				{site && (
					<span className="ml-1.5">
						<TextLink href={site} external>
							{site.replace(/^https?:\/\//, "")}
						</TextLink>
					</span>
				)}
			</div>
		</div>
	);
};
