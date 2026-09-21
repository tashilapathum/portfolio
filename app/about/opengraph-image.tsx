import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "../components/og-sheet";
import { SITE } from "../components/site";

export const alt = `About ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	return ogSheet({
		kicker: SITE.location,
		title: SITE.fullName,
		sheet: "About",
		note: `${SITE.role}. Seven years of native Android, 15+ apps shipped.`,
	});
}
