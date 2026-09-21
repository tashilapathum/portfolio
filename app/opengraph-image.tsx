import { allProjects } from "contentlayer/generated";
import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "./components/og-sheet";
import { SITE } from "./components/site";

export const alt = `${SITE.name}, ${SITE.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	const count = allProjects.filter((p) => p.published).length;
	return ogSheet({
		kicker: SITE.subRole,
		title: "I build Android apps that feel exciting to use.",
		sheet: `${count} projects`,
	});
}
