import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { allLegalPages, allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import {
	IndexCard,
	Label,
	Main,
	Paper,
	Photo,
	SectionHead,
} from "@/app/components/paper";
import { Header } from "./header";
import { Footer, type LegalLink } from "./footer";
import "./mdx.css";

export const revalidate = 60;

type Props = { params: { slug: string } };

const LEGAL_LABELS: Record<string, string> = {
	privacy: "Privacy Policy",
	terms: "Terms of Service",
	deletion: "Account Deletion",
};
const LEGAL_ORDER = ["privacy", "terms", "deletion"];

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allProjects.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
	const project = allProjects.find((p) => p.slug === params?.slug);
	if (!project) return {};
	return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
	const slug = params?.slug;
	const project = allProjects.find((p) => p.slug === slug);

	if (!project) {
		notFound();
	}

	// Same ordering as the index, so the breadcrumb rank matches.
	const ordered = allProjects
		.filter((p) => p.published)
		.sort((a, b) => {
			if (a.featured != null && b.featured != null)
				return a.featured - b.featured;
			if (a.featured != null) return -1;
			if (b.featured != null) return 1;
			return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
		});
	const index = ordered.findIndex((p) => p.slug === slug);
	const next = index >= 0 ? ordered[(index + 1) % ordered.length] : undefined;

	const legalLinks: LegalLink[] = LEGAL_ORDER.filter((type) =>
		allLegalPages.some(
			(doc) => doc.projectSlug === slug && doc.pageType === type,
		),
	).map((type) => ({
		label: LEGAL_LABELS[type],
		href: `/projects/${slug}/${type}`,
	}));

	// The index shot and the hero can differ; `hero` wins on the detail page.
	const heroSrc = project.hero ?? project.image;
	const heroFit = project.heroFit ?? project.imageFit;
	const heroContain = heroFit === "contain";
	// A low-res store banner: cropped, then dressed so the upscale doesn't show.
	const heroBanner = heroFit === "banner";

	return (
		<Main>
			<Header project={project} />

			{/* The hero, mounted.
			 *
			 * All three fits become a print on the page rather than a
			 * full-bleed image: the covers are saturated store banners, and
			 * the paper border is what stops them fighting the stock they
			 * sit on. A banner additionally gets grain, scanlines and a
			 * vignette, because those covers are low-res and the dressing
			 * is what hides the upscale. */}
			{heroSrc && heroBanner ? (
				<Paper curl={2} radius="rounded-[2px]" tilt={-0.5}>
					<div className="p-2 pb-6 sm:p-2.5 sm:pb-8">
						<div className="relative aspect-[2/1] overflow-hidden bg-desk-2 sm:aspect-[3/1]">
							<Image
								src={heroSrc}
								alt={project.imageAlt ?? `${project.title} cover`}
								fill
								sizes="(min-width: 1280px) 1100px, 100vw"
								className="object-cover"
								style={{ objectPosition: project.heroPosition ?? "50% 40%" }}
								priority
							/>
							<div
								aria-hidden="true"
								className="banner-texture absolute inset-0"
							/>
							<div
								aria-hidden="true"
								className="banner-scrim absolute inset-0"
							/>
						</div>
					</div>
				</Paper>
			) : heroSrc ? (
				// A `contain` hero is a logo or a single screen, not a wide
				// shot. Run it full width and it becomes a wall of empty
				// mount, so it is capped to the size of an actual print.
				<Photo
					src={heroSrc}
					alt={project.imageAlt ?? `${project.title} screenshot`}
					mount="tape"
					fit={heroContain ? "contain" : "cover"}
					aspect={heroContain ? "aspect-[4/3]" : "aspect-[21/9]"}
					className={heroContain ? "max-w-[420px]" : ""}
					sizes={
						heroContain
							? "(min-width: 640px) 420px, 100vw"
							: "(min-width: 1280px) 1100px, 100vw"
					}
					tilt={-0.5}
					priority
				/>
			) : null}

			{/* Fact cards */}
			{project.facts && project.facts.length > 0 && (
				<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{project.facts.map((fact, i) => (
						<Paper
							key={fact.label}
							stock="card"
							tilt={[-0.5, 0.4, -0.3, 0.5][i % 4]}
						>
							<div className="p-5">
								<Label>{fact.label}</Label>
								<div className="mt-2.5 font-title text-[16px] font-bold uppercase leading-snug tracking-[-.01em] text-graphite">
									{fact.value}
								</div>
							</div>
						</Paper>
					))}
				</div>
			)}

			<div className="grid gap-12 pt-14 lg:grid-cols-[1fr_260px]">
				<div className="min-w-0">
					{/* Specs belong on graph paper: that is the stock's whole job. */}
					{project.specs && project.specs.length > 0 && (
						<>
							<SectionHead title="At a glance" className="mb-5" />
							<Paper stock="graph" curl={0}>
								<div className="divide-y divide-rule/10">
									{project.specs.map((spec) => (
										<div
											key={spec.label}
											className="grid gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[150px_1fr]"
										>
											<span className="font-mono text-[10.5px] uppercase leading-snug tracking-[.14em] text-graphite-faint">
												{spec.label}
											</span>
											<span className="text-[14.5px] leading-normal text-graphite">
												{spec.value}
											</span>
										</div>
									))}
								</div>
							</Paper>
						</>
					)}

					{project.notes && project.notes.length > 0 && (
						<>
							<SectionHead title="Engineering notes" className="mb-5 mt-14" />
							<div className="grid gap-5 sm:grid-cols-2">
								{project.notes.map((note, i) => (
									<IndexCard
										key={note.title}
										title={note.title}
										tilt={i % 2 === 0 ? -0.4 : 0.5}
									>
										{note.body}
									</IndexCard>
								))}
							</div>
						</>
					)}

					<Paper curl={0} className="mt-14">
						<article className="prose prose-paper max-w-none px-6 py-9 sm:px-10 sm:py-12">
							<Mdx
								code={project.body.code}
								hideImage={project.image}
								hideHeading={project.title}
							/>
						</article>
					</Paper>
				</div>

				{/*
				 * `overflow-x: clip` on body (see `layout.tsx`) creates no
				 * scroll container, so this sticky still works. It would
				 * not under `overflow-x: hidden`.
				 */}
				<aside className="grid content-start gap-7 lg:sticky lg:top-28">
					{project.portrait && (
						<Photo
							src={project.portrait}
							alt={`${project.title} portrait screenshot`}
							mount="photo-corners"
							aspect="aspect-[9/19.5]"
							sizes="260px"
							tilt={1.2}
						/>
					)}
					{next && (
						<Link href={`/projects/${next.slug}`}>
							<Paper stock="card" tilt={-0.6}>
								<div className="p-5">
									<Label>Next project</Label>
									<div className="mt-2.5 font-title text-[17px] font-bold uppercase leading-snug tracking-[-.01em] text-graphite">
										{next.title}
									</div>
									<div className="mt-3 font-mono text-[10.5px] uppercase tracking-[.16em] text-vermillion">
										Open the file
									</div>
								</div>
							</Paper>
						</Link>
					)}
				</aside>
			</div>

			<Footer links={legalLinks} />
		</Main>
	);
}
