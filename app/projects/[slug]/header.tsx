"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShareSheet from "@/app/components/share";
import { Button, Title } from "@/app/components/paper";

type Props = {
	project: {
		slug: string;
		url?: string;
		title: string;
		description?: string;
		tagline?: string;
		repository?: string;
	};
	/** Extra link shown as a text link, e.g. a project landing page. */
	site?: string;
};

export function Header({ project, site }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState("");

	// Read the location after mount rather than during render, so this
	// stays safe if the share sheet ever renders before a click.
	useEffect(() => setUrl(window.location.href), []);

	return (
		<div className="relative pb-10">
			<div className="flex items-start justify-between gap-6">
				<Link
					href="/projects"
					className="font-mono text-[10.5px] uppercase tracking-[.2em] text-graphite-faint transition-colors duration-200 hover:text-vermillion"
				>
					&larr; Projects
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

			<Title as="h1" className="mt-6 text-[42px] sm:text-[58px] lg:text-[72px]">
				{project.title}
			</Title>
			<p className="mt-5 max-w-[56ch] text-[16.5px] leading-relaxed text-graphite-soft">
				{project.tagline ?? project.description}
			</p>

			<div className="mt-8 flex flex-wrap items-center gap-3.5">
				{project.repository && (
					<Button href={`https://github.com/${project.repository}`} external>
						View source
					</Button>
				)}
				{project.url && (
					<Button
						href={project.url}
						// `quiet`, not `ghost`: the paper Button has a different
						// variant vocabulary to the old one, and `ghost` would
						// silently fall through to primary.
						variant={project.repository ? "quiet" : "primary"}
						external
					>
						Play Store
					</Button>
				)}
				{site && (
					<a
						href={site}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-1 font-mono text-[11px] uppercase tracking-[.16em] text-vermillion"
					>
						{site.replace(/^https?:\/\//, "")}
					</a>
				)}
			</div>
		</div>
	);
}
