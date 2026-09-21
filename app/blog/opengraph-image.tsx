import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "../components/og-sheet";

export const alt = "Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	return ogSheet({
		kicker: "Build logs",
		title: "Things I had to figure out the hard way.",
		sheet: "Blog",
	});
}
