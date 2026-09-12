"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eyebrow, PlaceholderTile, TextLink } from "../components/ui";

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

const BACK_CATALOGUE_STEP = 6;

function Shot({
	project,
	className,
	accent,
	sizes,
}: {
	project: ProjectItem;
	className: string;
	accent: boolean;
	sizes: string;
}) {
	if (!project.image) {
		return (
			<PlaceholderTile
				label={project.title}
				accent={accent}
				className={className}
			/>
		);
	}
	const contain = project.imageFit === "contain";

	return (
		<div
			className={`relative overflow-hidden bg-surface2 ${className} ${
				accent ? "border border-accent/35" : "border border-white/10"
			}`}
		>
			<Image
				src={project.image}
				alt={project.imageAlt ?? `${project.title} screenshot`}
				fill
				sizes={sizes}
				unoptimized={project.image.endsWith(".svg")}
				className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
					contain ? "object-contain p-2.5" : "object-cover"
				}`}
			/>
		</div>
	);
}

function Meta({ project, rank }: { project: ProjectItem; rank: number }) {
	return (
		<Eyebrow>
			{String(rank).padStart(2, "0")}
			{project.category ? ` · ${project.category}` : ""}
			{project.year ? ` · ${project.year}` : ""}
		</Eyebrow>
	);
}

/** A featured project: full-scale, alternating left/right. */
function Act({
	project,
	rank,
	flip,
	delay,
}: {
	project: ProjectItem;
	rank: number;
	flip: boolean;
	delay: string;
}) {
	const shot = (
		<div className="relative">
			{!flip && (
				<div
					aria-hidden="true"
					className="glow absolute inset-[-14%]"
					style={{ ["--glow-strength" as string]: 0.3 }}
				/>
			)}
			<Shot
				project={project}
				accent={!flip}
				className={`relative aspect-[4/3] w-full rounded-[20px] ${
					!flip ? "shadow-accent-card" : ""
				}`}
				sizes="(min-width: 1024px) 300px, 100vw"
			/>
		</div>
	);

	const body = (
		<div className={flip ? "md:text-right" : ""}>
			<Meta project={project} rank={rank} />
			<h3 className="mt-3 font-display text-4xl leading-none text-white lg:text-[46px]">
				<Link
					href={`/projects/${project.slug}`}
					className="transition-colors duration-200 hover:text-accent"
				>
					{project.title}
				</Link>
			</h3>
			<p
				className={`mt-3.5 max-w-[560px] text-[15.5px] leading-relaxed text-[#9AA3AA] ${
					flip ? "md:ml-auto" : ""
				}`}
			>
				{project.tagline ?? project.description}
			</p>
			{project.tech.length > 0 && (
				<div
					className={`mt-4 flex flex-wrap gap-5 font-mono text-[11.5px] uppercase text-muted2 ${
						flip ? "md:justify-end" : ""
					}`}
				>
					{project.tech.map((t) => (
						<span key={t}>{t}</span>
					))}
				</div>
			)}
			<div className="mt-5">
				<TextLink href={`/projects/${project.slug}`}>
					Read the case study
				</TextLink>
			</div>
		</div>
	);

	return (
		<div
			style={{ animationDelay: delay }}
			className={`group grid animate-rise-in items-center gap-11 border-b border-line py-11 ${
				flip ? "md:grid-cols-[1fr_300px]" : "md:grid-cols-[300px_1fr]"
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

/** Back catalogue: same rhythm, half height. */
function Row({
	project,
	rank,
	flip,
	delay,
}: {
	project: ProjectItem;
	rank: number;
	flip: boolean;
	delay: string;
}) {
	const shot = (
		<Shot
			project={project}
			accent={false}
			className="aspect-[16/10] w-full rounded-[14px]"
			sizes="(min-width: 768px) 190px, 100vw"
		/>
	);
	const body = (
		<div className={flip ? "md:text-right" : ""}>
			<Meta project={project} rank={rank} />
			<h3 className="mt-2 font-display text-[30px] leading-none text-white">
				<Link
					href={`/projects/${project.slug}`}
					className="transition-colors duration-200 hover:text-accent"
				>
					{project.title}
				</Link>
			</h3>
			<p
				className={`mt-2 max-w-[600px] text-sm leading-relaxed text-muted ${
					flip ? "md:ml-auto" : ""
				}`}
			>
				{project.description}
			</p>
		</div>
	);

	return (
		<div
			style={{ animationDelay: delay }}
			className={`group grid animate-rise-in items-center gap-8 border-b border-line py-6 ${
				flip ? "md:grid-cols-[1fr_190px]" : "md:grid-cols-[190px_1fr]"
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
	// Rows at or after this index were just revealed, so only they stagger in.
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

	// The back catalogue loads itself as you reach the end of it. The sentinel
	// only exists while rows are left, so the observer stops with the list.
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
			{/* Tabs */}
			<div className="-mb-px flex gap-6 overflow-x-auto pb-px">
				{[{ label: "All", count: projects.length }, ...categories].map((c) => (
					<button
						key={c.label}
						type="button"
						onClick={() => selectTab(c.label)}
						className={`flex-none whitespace-nowrap border-b-2 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-[.18em] transition-colors duration-200 ${
							tab === c.label
								? "border-accent text-white"
								: "border-transparent text-muted2 hover:text-fg"
						}`}
					>
						{c.label} {c.count}
					</button>
				))}
			</div>

			<div className="mt-2" key={tab}>
				{featured.map((project, i) => (
					<Act
						key={project.slug}
						project={project}
						rank={i + 1}
						flip={i % 2 === 1}
						delay={stagger(i)}
					/>
				))}

				{visibleRest.length > 0 && (
					<>
						{featured.length > 0 && (
							<div className="px-0 pb-1.5 pt-7 font-mono text-[10.5px] font-medium uppercase tracking-[.2em] text-muted2">
								Back catalogue · same rhythm, half height
							</div>
						)}
						{visibleRest.map((project, i) => (
							<Row
								key={project.slug}
								project={project}
								rank={featured.length + i + 1}
								flip={(featured.length + i) % 2 === 1}
								delay={stagger(i >= revealedFrom ? i - revealedFrom : 0)}
							/>
						))}
					</>
				)}

				{remaining > 0 && (
					<div ref={sentinel} aria-hidden="true" className="h-px" />
				)}

				{filtered.length === 0 && (
					<p className="py-16 text-center font-mono text-xs uppercase tracking-[.2em] text-muted2">
						Nothing here yet
					</p>
				)}
			</div>
		</>
	);
}
