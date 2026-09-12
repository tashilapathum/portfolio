import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Glow } from "../components/ui";
import { spell } from "../components/site";
import { ProjectsList, type ProjectItem } from "./projects-list";

export const revalidate = 60;

const CATEGORY_ORDER = ["Hobby", "Freelancing", "Library", "Work"];

export default function ProjectsPage() {
	const published = allProjects.filter((p) => p.published);

	// Featured first, in explicit order; everything else newest-first.
	const sorted = [...published].sort((a, b) => {
		if (a.featured != null && b.featured != null)
			return a.featured - b.featured;
		if (a.featured != null) return -1;
		if (b.featured != null) return 1;
		return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
	});

	const projects: ProjectItem[] = sorted.map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description,
		category: p.category ?? null,
		year: p.date ? new Date(p.date).getFullYear().toString() : null,
		tech: p.tech ?? [],
		image: p.image ?? null,
		imageAlt: p.imageAlt ?? null,
		imageFit: p.imageFit === "contain" ? "contain" : "cover",
		tagline: p.tagline ?? null,
		featured: p.featured ?? null,
	}));

	// Counts derived from content — never hardcoded.
	const categories = CATEGORY_ORDER.filter((label) =>
		projects.some((p) => p.category === label),
	).map((label) => ({
		label,
		count: projects.filter((p) => p.category === label).length,
	}));

	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-48 left-[-140px] h-[520px] w-[760px]"
				strength={0.2}
			/>

			<main className="relative mx-auto max-w-7xl px-6 pt-28 lg:px-12">
				<div className="flex flex-wrap items-end justify-between gap-9 border-b border-white/10 pb-6">
					<h1 className="m-0 font-display text-5xl leading-[.96] text-fg-strong sm:text-6xl lg:text-[72px]">
						{spell(projects.length)}
						<br />
						projects.
					</h1>
					<p className="m-0 max-w-[380px] text-[14.5px] leading-relaxed text-muted">
						Personal apps, client work and Android libraries. Some freelance
						apps were pulled from Play by their owners — the write-ups stay as a
						record.
					</p>
				</div>

				<div className="mt-6">
					<ProjectsList projects={projects} categories={categories} />
				</div>

				<div className="h-14" />
			</main>
		</div>
	);
}
