"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	IndexCard,
	Label,
	Photo,
	Tab,
	TabStrip,
	Title,
} from "../components/paper";

export type ProjectItem = {
	slug: string;
	title: string;
	description: string;
	category: string | null;
	year: string | null;
	tech: string[];
	image: string | null;
	imageAlt: string | null;
	imageFit: "cover" | "contain";
	tagline: string | null;
	featured: number | null;
};

const BACK_CATALOGUE_STEP = 9;

/**
 * A featured project: a mounted print beside its write-up, alternating
 * sides. Four of these is the whole budget, which is also the limit of
 * what an alternating rhythm can carry before it reads as a template.
 * Everything after them is the catalogue grid below.
 */
function Act({
	project,
	flip,
	delay,
}: {
	project: ProjectItem;
	flip: boolean;
	delay: string;
}) {
	const shot = project.image ? (
		<Photo
			src={project.image}
			alt={project.imageAlt ?? `${project.title} screenshot`}
			mount={flip ? "corners" : "tape"}
			fit={project.imageFit}
			tilt={flip ? 1.1 : -1.3}
			sizes="(min-width: 768px) 340px, 100vw"
		/>
	) : null;

	const body = (
		<div>
			<Label>
				{project.category ?? "Project"}
				{project.year ? ` · ${project.year}` : ""}
			</Label>
			<Title as="h3" className="mt-3.5 text-[34px] sm:text-[42px]">
				<Link href={`/projects/${project.slug}`}>{project.title}</Link>
			</Title>
			<p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-graphite-soft">
				{project.tagline ?? project.description}
			</p>
			{project.tech.length > 0 && (
				<div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10.5px] uppercase tracking-[.14em] text-graphite-faint">
					{project.tech.map((t) => (
						<span key={t}>{t}</span>
					))}
				</div>
			)}
			<Link
				href={`/projects/${project.slug}`}
				className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[.16em] text-vermillion"
			>
				Read the case study
			</Link>
		</div>
	);

	// A project with no artwork has nothing to mount, so it runs full
	// width rather than leaving a hole where the print should be.
	if (!shot) {
		return (
			<div style={{ animationDelay: delay }} className="animate-rise-in py-12">
				{body}
			</div>
		);
	}

	return (
		<div
			style={{ animationDelay: delay }}
			className={`animate-rise-in grid items-center gap-10 py-12 md:gap-14 ${
				flip ? "md:grid-cols-[1fr_340px]" : "md:grid-cols-[340px_1fr]"
			}`}
		>
			{flip ? (
				<>
					<div className="order-2 md:order-1">{body}</div>
					<div className="order-1 md:order-2">{shot}</div>
				</>
			) : (
				<>
					{shot}
					{body}
				</>
			)}
		</div>
	);
}

export function ProjectsList({
	projects,
	categories,
}: {
	projects: ProjectItem[];
	categories: { label: string; count: number }[];
}) {
	const [tab, setTab] = useState<string>("All");
	const [shown, setShown] = useState(BACK_CATALOGUE_STEP);
	// Cards at or after this index were just revealed, so only they stagger.
	const [revealedFrom, setRevealedFrom] = useState(0);

	const filtered = useMemo(
		() =>
			tab === "All" ? projects : projects.filter((p) => p.category === tab),
		[projects, tab],
	);

	const featured = filtered.filter((p) => p.featured != null);
	const rest = filtered.filter((p) => p.featured == null);
	const visibleRest = rest.slice(0, shown);
	const remaining = rest.length - visibleRest.length;

	const selectTab = (label: string) => {
		setTab(label);
		setShown(BACK_CATALOGUE_STEP);
		setRevealedFrom(0);
	};

	const loadMore = useCallback(() => {
		setRevealedFrom(shown);
		setShown((s) => s + BACK_CATALOGUE_STEP);
	}, [shown]);

	// The catalogue loads itself as you reach the end of it. The sentinel
	// only exists while cards are left, so the observer stops with the list.
	const sentinel = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = sentinel.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) loadMore();
			},
			{ rootMargin: "600px 0px" },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [loadMore]);

	/** Capped so a long list staggers pleasantly instead of crawling. */
	const stagger = (i: number) => `${Math.min(i, 7) * 45}ms`;

	return (
		<>
			<TabStrip className="mt-9">
				{[{ label: "All", count: projects.length }, ...categories].map((c) => (
					<Tab
						key={c.label}
						active={tab === c.label}
						onClick={() => selectTab(c.label)}
					>
						{c.label} {c.count}
					</Tab>
				))}
			</TabStrip>

			{/* Re-keyed on the tab so a filter change replays the stagger
			    rather than swapping content in place. */}
			<div key={tab}>
				{featured.map((project, i) => (
					<Act
						key={project.slug}
						project={project}
						flip={i % 2 === 1}
						delay={stagger(i)}
					/>
				))}

				{visibleRest.length > 0 && (
					<>
						{featured.length > 0 && (
							<div className="mb-7 mt-6 flex items-baseline gap-4">
								<Label>The rest of the drawer</Label>
								<span aria-hidden="true" className="h-px flex-1 bg-rule/15" />
							</div>
						)}

						{/*
						 * A catalogue, not fifteen more left/right splits.
						 * Only 4 of 19 projects carry artwork, so a typed
						 * card is the honest entry for the other fifteen and
						 * a grid of them reads as a card drawer rather than
						 * as a list with holes in it.
						 */}
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{visibleRest.map((project, i) => (
								<Link
									key={project.slug}
									href={`/projects/${project.slug}`}
									style={{
										animationDelay: stagger(
											i >= revealedFrom ? i - revealedFrom : 0,
										),
									}}
									className="animate-rise-in"
								>
									<IndexCard
										title={project.title}
										meta={[project.category, project.year]
											.filter(Boolean)
											.join(" · ")}
										tilt={[-0.6, 0.5, -0.3, 0.7, -0.4, 0.3][i % 6]}
									>
										{project.description}
									</IndexCard>
								</Link>
							))}
						</div>
					</>
				)}

				{remaining > 0 && (
					<div ref={sentinel} aria-hidden="true" className="h-px" />
				)}

				{filtered.length === 0 && (
					<p className="py-16 text-center font-mono text-xs uppercase tracking-[.2em] text-graphite-faint">
						Nothing filed under {tab}
					</p>
				)}
			</div>
		</>
	);
}
