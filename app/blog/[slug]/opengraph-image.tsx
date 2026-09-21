import { allBlogPosts } from "contentlayer/generated";
import { OG_CONTENT_TYPE, OG_SIZE, ogSheet } from "@/app/components/og-sheet";

type Props = { params: { slug: string } };

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allBlogPosts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: Props) {
	const post = allBlogPosts.find((p) => p.slug === params.slug);

	return ogSheet({
		kicker: post?.formattedDate ?? "Blog",
		title: post?.title ?? "Blog",
		sheet: post ? `${post.readingTime} min read` : "Post",
		note: post?.description,
	});
}
