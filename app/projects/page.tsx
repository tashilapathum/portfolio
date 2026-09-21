import { allProjects } from "contentlayer/generated";
import { Main, Title } from "../components/paper";
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
		<Main>
			<div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
				<Title as="h1" className="text-[46px] sm:text-[60px] lg:text-[72px]">
					{spell(projects.length)}
					<br />
					projects.
				</Title>
				<p className="m-0 max-w-[38ch] pb-1.5 text-[14.5px] leading-relaxed text-graphite-soft">
					Personal apps, client work and Android libraries. Some freelance apps
					were pulled from Play by their owners. The write-ups stay as a record.
				</p>
			</div>

			<ProjectsList projects={projects} categories={categories} />
		</Main>
	);
}
