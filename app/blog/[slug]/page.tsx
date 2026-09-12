import { notFound } from "next/navigation";
import { allBlogPosts } from "contentlayer/generated";
import "../../projects/[slug]/mdx.css";
import { Mdx } from "@/app/components/mdx";
import { Navigation } from "@/app/components/nav";
import { Glow } from "@/app/components/ui";
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
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-44 right-[-120px] h-[460px] w-[720px]"
				strength={0.22}
				pulse
			/>

			<main className="relative mx-auto max-w-3xl px-6 pb-20 pt-16">
				<Header post={post} />
				<article className="prose prose-invert prose-quoteless max-w-none border-t border-line pt-10">
					<Mdx code={post.body.code} />
				</article>
			</main>
		</div>
	);
}
