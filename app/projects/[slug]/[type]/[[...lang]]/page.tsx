import { allLegalPages, allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Main, Paper, Title } from "@/app/components/paper";
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
		<Main className="max-w-3xl">
			<Link
				href={`/projects/${params.slug}`}
				className="font-mono text-[10.5px] uppercase tracking-[.2em] text-graphite-faint transition-colors duration-200 hover:text-vermillion"
			>
				&larr;{" "}
				{allProjects.find((p) => p.slug === params.slug)?.title ?? params.slug}
			</Link>

			{/*
			 * `lang` wraps the heading as well as the body, not just the
			 * article. The script fallbacks in `global.css` key off
			 * `:lang()`, and with the attribute on the article alone a
			 * Sinhala or Japanese title still rendered uppercase at
			 * Archivo's tracking, which those scripts have no case for.
			 */}
			<div lang={lang}>
				<div className="mt-6 flex flex-wrap items-start justify-between gap-5">
					<Title as="h1" className="text-[30px] sm:text-[40px]">
						{page.title}
					</Title>
					<LanguageSwitcher
						slug={params.slug}
						type={params.type}
						available={available}
						current={lang}
					/>
				</div>

				{/* Pinned flat, per the curl table: legal text is not
				    something anyone picks up. */}
				<Paper curl={0} className="mt-9">
					<article className="prose prose-paper max-w-none px-6 py-9 sm:px-10 sm:py-12">
						<Mdx code={page.body.code} />
					</article>
				</Paper>
			</div>
		</Main>
	);
}
