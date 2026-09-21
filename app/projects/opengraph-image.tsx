import { allProjects } from "contentlayer/generated";
import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "../components/og-sheet";
import { spell } from "../components/site";

export const alt = "Projects";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	const count = allProjects.filter((p) => p.published).length;
	return ogSheet({
		kicker: "Apps, libraries and client work",
		title: `${spell(count)} projects.`,
		sheet: "Index",
		note: "Personal apps, client work and Android libraries.",
	});
}
