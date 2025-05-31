import Link from "next/link";
import { allBlogPosts } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

export const revalidate = 60;
export default async function BlogPage() {
    const featuredPosts = allBlogPosts
        .filter(post => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3); // Get 3 most recent posts as featured

    const remainingPosts = allBlogPosts
        .filter(post => post.published)
        .filter(post => !featuredPosts.includes(post))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <Navigation />
            <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                        Blog
                    </h2>
                    <p className="mt-4 text-zinc-400">
                        Thoughts, tutorials, and updates on development, design, and technology.
                    </p>
                </div>
                <div className="w-full h-px bg-zinc-800" />

                {/* Featured Posts - 3 in a row */}
                <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
                    {featuredPosts.map((post) => (
                        <Card key={post.slug}>
                            <Link href={`/blog/${post.slug}`}>
                                <article className="relative w-full h-full p-4 md:p-8">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs text-zinc-100">
                                            <time dateTime={new Date(post.date).toISOString()}>
                                                {Intl.DateTimeFormat(undefined, {
                                                    dateStyle: "medium",
                                                }).format(new Date(post.date))}
                                            </time>
                                        </div>
                                    </div>

                                    <h2
                                        id="featured-post"
                                        className="mt-4 text-2xl font-bold text-zinc-100 group-hover:text-white sm:text-3xl font-display"
                                    >
                                        {post.title}
                                    </h2>
                                    <p className="mt-4 mb-12 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 line-clamp-3">
                                        {post.description}
                                    </p>
                                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
                                        <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                            Read more <span aria-hidden="true">&rarr;</span>
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        </Card>
                    ))}
                </div>

                <div className="hidden w-full h-px md:block bg-zinc-800" />

                {/* Remaining Posts - Full width single column */}
                <div className="flex flex-col gap-8 mx-auto lg:mx-0">
                    {remainingPosts.map((post) => (
                        <Card key={post.slug}>
                            <Link href={`/blog/${post.slug}`} className="block w-full">
                                <article className="relative w-full h-full p-4 md:p-8">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs text-zinc-100">
                                            <time dateTime={new Date(post.date).toISOString()}>
                                                {Intl.DateTimeFormat(undefined, {
                                                    dateStyle: "medium",
                                                }).format(new Date(post.date))}
                                            </time>
                                        </div>
                                    </div>

                                    <h2
                                        className="mt-4 text-2xl font-bold text-zinc-100 group-hover:text-white sm:text-3xl font-display"
                                    >
                                        {post.title}
                                    </h2>
                                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                                        {post.description}
                                    </p>
                                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
                                        <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                            Read more <span aria-hidden="true">&rarr;</span>
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}