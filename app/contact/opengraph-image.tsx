import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "../components/og-sheet";
import { SITE } from "../components/site";

export const alt = `Contact ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	return ogSheet({
		kicker: "Get in touch",
		title: "Say hello.",
		sheet: SITE.email,
		note: "Roles, collaborations, or a question about a project.",
	});
}
