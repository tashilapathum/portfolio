import {allLegalPages} from "contentlayer/generated";
import {Mdx} from "@/app/components/mdx";
import React from "react";
import {notFound} from "next/navigation";
import {Header} from "@/app/projects/[slug]/header";

export default function LegalPage({params}: { params: { slug: string; type: string } }) {

    const legalPage = allLegalPages.find(
        (page) => page.pageType === params.type && page.projectSlug === params.slug
    );

    if (!legalPage) return notFound();

    return (
        <header>
            <div>
                <Header project={legalPage}/>
                <div className="bg-zinc-50 min-h-screen">
                    <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                        <Mdx code={legalPage.body.code}/>
                    </article>
                </div>
            </div>
        </header>
    );
}