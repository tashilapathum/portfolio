import Link from "next/link";
import { Metadata } from "next";
import { allBlogPosts } from "contentlayer/generated";
import { IndexCard, Label, Main, Paper, Title } from "../components/paper";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "Blog",
	description: "Build logs and things I had to figure out the hard way.",
};

export default function BlogPage() {
	const posts = allBlogPosts
		.filter((post) => post.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const [latest, ...rest] = posts;

	return (
		<Main className="max-w-3xl">
			<Title as="h1" className="text-[38px] sm:text-[52px]">
				Blog
			</Title>
			<p className="mb-10 mt-4 max-w-[52ch] text-[15px] leading-relaxed text-graphite-soft">
				Build logs and things I had to figure out the hard way.
			</p>

			{latest && (
				<Paper curl={2} tilt={-0.4}>
					<Link href={`/blog/${latest.slug}`} className="block p-6 sm:p-8">
						<div className="flex items-baseline justify-between gap-4">
							<Label>Latest</Label>
							<span className="font-mono text-[10.5px] tabular-nums tracking-[.16em] text-graphite-faint">
								{latest.readingTime} MIN
							</span>
						</div>
						<Title as="h2" className="mt-4 text-[26px] sm:text-[32px]">
							{latest.title}
						</Title>
						<p className="mt-3.5 max-w-[56ch] text-[14px] leading-relaxed text-graphite-soft">
							{latest.description}
						</p>
						<div className="mt-5 font-mono text-[11px] uppercase tracking-[.16em] text-vermillion">
							Read the post
						</div>
					</Link>
				</Paper>
			)}

			{rest.length > 0 && (
				<div className="mt-10 grid gap-6 sm:grid-cols-2">
					{rest.map((post, i) => (
						<Link key={post.slug} href={`/blog/${post.slug}`}>
							<IndexCard
								title={post.title}
								meta={`${post.formattedDate} · ${post.readingTime} min`}
								tilt={i % 2 === 0 ? -0.5 : 0.4}
							>
								{post.description}
							</IndexCard>
						</Link>
					))}
				</div>
			)}

			{posts.length === 0 && (
				<p className="py-16 text-center font-mono text-xs uppercase tracking-[.2em] text-graphite-faint">
					Nothing published yet
				</p>
			)}
		</Main>
	);
}
