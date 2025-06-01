import { notFound } from "next/navigation";
import { allBlogPosts } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";

export const revalidate = 60;

type Props = {
    params: {
        slug: string;
    };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
    return allBlogPosts
        .filter((p) => p.published)
        .map((p) => ({
            slug: p.slug,
        }));
}

export default async function PostPage({ params }: Props) {
    const slug = params?.slug;
    const post = allBlogPosts.find((post) => post.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <Header post={post} />
            <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                <Mdx code={post.body.code} />
            </article>
        </div>
    );
}