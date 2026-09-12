import { allLegalPages, allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/app/components/nav";
import { Eyebrow, Glow } from "@/app/components/ui";
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
		(p) =>
			p.pageType === params.type &&
			p.projectSlug === params.slug &&
			p.lang === lang,
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
			.filter(
				(p) => p.pageType === params.type && p.projectSlug === params.slug,
			)
			.map((p) => p.lang),
	);
	const available = SUPPORTED_LOCALES.map((l) => l.code).filter((c) =>
		availableSet.has(c),
	);

	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-44 right-[-120px] h-[420px] w-[680px]"
				strength={0.18}
			/>

			<main className="relative mx-auto max-w-3xl px-6 pb-20 pt-28">
				<Eyebrow tone="muted">
					<a
						href={`/projects/${params.slug}`}
						className="transition-colors duration-200 hover:text-fg"
					>
						&larr;{" "}
						{allProjects.find((p) => p.slug === params.slug)?.title ??
							params.slug}
					</a>
				</Eyebrow>

				<div className="mt-4 flex flex-wrap items-start justify-between gap-4">
					<h1 className="m-0 font-display text-4xl leading-tight text-fg-strong sm:text-5xl">
						{page.title}
					</h1>
					<LanguageSwitcher
						slug={params.slug}
						type={params.type}
						available={available}
						current={lang}
					/>
				</div>

				<article
					lang={lang}
					className="prose prose-invert prose-quoteless mt-8 max-w-none border-t border-line pt-8"
				>
					<Mdx code={page.body.code} />
				</article>
			</main>
		</div>
	);
}
