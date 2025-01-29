import {allLegalPages} from "contentlayer/generated";
import {Mdx} from "@/app/components/mdx";
import React from "react";
import {notFound} from "next/navigation";

export default function LegalPage({params}: { params: { slug: string; type: string } }) {

    const legalPage = allLegalPages.find(
        (page) => page.pageType === params.type && page.projectSlug === params.slug
    );

    if (!legalPage) return notFound();

    return (
        <header>
            <div>
                <div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
                                {legalPage.title}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-50 min-h-screen">
                    <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                        <Mdx code={legalPage.body.code}/>
                    </article>
                </div>
            </div>
        </header>
    );
}