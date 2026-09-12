import Link from "next/link";
import { Metadata } from "next";
import { allBlogPosts } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Glow, TextLink } from "../components/ui";

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
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-40 right-[-120px] h-[380px] w-[520px]"
				strength={0.2}
			/>

			<main className="relative mx-auto max-w-2xl px-6 pb-20 pt-28">
				<h1 className="m-0 font-display text-4xl leading-tight text-fg-strong sm:text-[42px]">
					Blog
				</h1>
				<p className="mb-7 mt-3 text-[14.5px] leading-relaxed text-muted">
					Build logs and things I had to figure out the hard way.
				</p>

				{latest && (
					<article className="mb-3 rounded-[20px] border border-accent/25 bg-gradient-to-b from-[#18222a] to-[#141719] p-6 shadow-[0_0_50px_-26px_rgba(14,165,233,.8)]">
						<div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[.12em] text-accent">
							<span>Latest</span>
							<span>{latest.readingTime} min</span>
						</div>
						<h2 className="mt-2.5 font-display text-[28px] leading-tight text-white">
							<Link
								href={`/blog/${latest.slug}`}
								className="transition-colors duration-200 hover:text-accent"
							>
								{latest.title}
							</Link>
						</h2>
						<p className="mt-2.5 text-sm leading-relaxed text-muted">
							{latest.description}
						</p>
						<div className="mt-4">
							<TextLink href={`/blog/${latest.slug}`}>Read the post</TextLink>
						</div>
					</article>
				)}

				<div className="grid gap-2.5">
					{rest.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className="flex items-center justify-between gap-4 rounded-[18px] border border-line bg-surface px-6 py-5 transition-colors duration-200 hover:border-line-strong"
						>
							<span>
								<span className="block text-[15px] font-semibold leading-snug text-fg">
									{post.title}
								</span>
								<span className="mt-1.5 block text-[13px] leading-relaxed text-muted">
									{post.description}
								</span>
							</span>
							<span className="flex-none font-mono text-xs text-muted2">
								{post.readingTime} min
							</span>
						</Link>
					))}
				</div>

				{posts.length === 0 && (
					<p className="py-16 text-center font-mono text-xs uppercase tracking-[.2em] text-muted2">
						Nothing published yet
					</p>
				)}
			</main>
		</div>
	);
}
