import { allProjects } from "contentlayer/generated";
import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "@/app/components/og-sheet";

type Props = { params: { slug: string } };

export const alt = "Project case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The image route needs its own params: the page's `generateStaticParams`
 * does not prerender it. Without this every card is generated on demand,
 * which is both slower and the one path where the font read is not
 * happening at build time.
 */
export async function generateStaticParams(): Promise<Props["params"][]> {
	return allProjects.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: Props) {
	const project = allProjects.find((p) => p.slug === params.slug);

	return ogSheet({
		kicker: project?.category ?? "Project",
		title: project?.title ?? "Project",
		sheet: project?.date
			? new Date(project.date).getFullYear().toString()
			: "Case study",
		note: project?.tagline ?? project?.description,
	});
}
