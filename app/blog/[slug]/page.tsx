import { notFound } from "next/navigation";
import { allBlogPosts } from "contentlayer/generated";
import "../../projects/[slug]/mdx.css";
import { Mdx } from "@/app/components/mdx";
import { Main, Paper } from "@/app/components/paper";
import { Header } from "./header";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allBlogPosts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
	const post = allBlogPosts.find((p) => p.slug === params?.slug);
	if (!post) return {};
	return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: Props) {
	const post = allBlogPosts.find((p) => p.slug === params?.slug);

	if (!post) {
		notFound();
	}

	return (
		<Main className="max-w-3xl">
			<Header post={post} />

			{/* Long-form copy is pinned flat. Curl is for things you could
			    pick up, and nobody picks up the page they are reading. */}
			<Paper curl={0}>
				<article className="prose prose-paper max-w-none px-6 py-9 sm:px-10 sm:py-12">
					<Mdx code={post.body.code} />
				</article>
			</Paper>
		</Main>
	);
}
