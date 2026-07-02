import { allLegalPages } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/app/projects/[slug]/header";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";

type Params = { slug: string; type: string; lang?: string[] };

// Every (slug, type) combination and its available locales. English is emitted
// with an empty `lang` so it lives at the canonical `/projects/{slug}/{type}`.
export function generateStaticParams(): Params[] {
	const params: Params[] = [];
	for (const page of allLegalPages) {
		params.push({
			slug: page.projectSlug,
			type: page.pageType,
			lang: page.lang === DEFAULT_LOCALE ? [] : [page.lang],
		});
	}
	return params;
}

function resolve(params: Params) {
	const lang = params.lang?.[0] ?? DEFAULT_LOCALE;
	const forLang = allLegalPages.find(
		(p) => p.pageType === params.type && p.projectSlug === params.slug && p.lang === lang,
	);
	const fallback = allLegalPages.find(
		(p) =>
			p.pageType === params.type &&
			p.projectSlug === params.slug &&
			p.lang === DEFAULT_LOCALE,
	);
	return { lang, page: forLang ?? fallback };
}

export function generateMetadata({ params }: { params: Params }): Metadata {
	const { lang, page } = resolve(params);
	if (!page) return {};

	// hreflang alternates for every locale that has a real translation.
	const available = allLegalPages.filter(
		(p) => p.pageType === params.type && p.projectSlug === params.slug,
	);
	const base = `/projects/${params.slug}/${params.type}`;
	const languages: Record<string, string> = {};
	for (const p of available) {
		languages[p.lang] = p.lang === DEFAULT_LOCALE ? base : `${base}/${p.lang}`;
	}

	return {
		title: page.title,
		alternates: { canonical: base, languages },
		openGraph: { title: page.title, locale: lang },
	};
}

export default function LegalPage({ params }: { params: Params }) {
	const { lang, page } = resolve(params);
	if (!page) return notFound();

	// Locales that actually have a file for this page, in canonical display order.
	const availableSet = new Set<string>(
		allLegalPages
			.filter((p) => p.pageType === params.type && p.projectSlug === params.slug)
			.map((p) => p.lang),
	);
	const available = SUPPORTED_LOCALES.map((l) => l.code).filter((c) => availableSet.has(c));

	return (
		<header>
			<div>
				<Header project={page} />
				<div className="bg-zinc-50 min-h-screen">
					<article
						lang={lang}
						className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless"
					>
						<div className="flex justify-end mb-8">
							<LanguageSwitcher
								slug={params.slug}
								type={params.type}
								available={available}
								current={lang}
							/>
						</div>
						<Mdx code={page.body.code} />
					</article>
				</div>
			</div>
		</header>
	);
}
