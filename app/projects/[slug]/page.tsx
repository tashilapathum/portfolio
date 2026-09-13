import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { allLegalPages, allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Navigation } from "@/app/components/nav";
import { Glow, Eyebrow, PlaceholderTile } from "@/app/components/ui";
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
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-44 right-[-120px] h-[520px] w-[780px]"
				strength={0.26}
				pulse
			/>

			<main className="relative mx-auto max-w-7xl px-6 pt-16 lg:px-12">
				<Header project={project} rank={index >= 0 ? index + 1 : undefined} />

				{/* Full-bleed hero */}
				{heroSrc && heroBanner ? (
					<div className="relative">
						{/* Ambient spill: the cover's own colours light the page around it */}
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-[4%] inset-y-[-6%] opacity-40"
						>
							<Image
								src={heroSrc}
								alt=""
								fill
								sizes="600px"
								className="scale-110 object-cover blur-3xl saturate-150"
							/>
						</div>
						{/* Store banners are ~2:1, so phones show all of it; wider screens crop */}
						<div className="relative aspect-[2/1] overflow-hidden rounded-[20px] border border-accent/30 sm:aspect-auto sm:h-[340px]">
							<Image
								src={heroSrc}
								alt={project.imageAlt ?? `${project.title} cover`}
								fill
								sizes="(min-width: 1280px) 1200px, 100vw"
								className="object-cover saturate-[1.15]"
								style={{ objectPosition: project.heroPosition ?? "50% 40%" }}
								priority
							/>
							<div
								aria-hidden="true"
								className="banner-texture absolute inset-0"
							/>
							<div aria-hidden="true" className="banner-scrim absolute inset-0" />
						</div>
					</div>
				) : heroSrc ? (
					<div
						className={`relative overflow-hidden rounded-[20px] border border-accent/30 shadow-[0_0_80px_-30px_rgba(14,165,233,.6)] ${
							heroContain ? "h-[420px] bg-surface2" : "h-[300px]"
						}`}
					>
						{heroContain && (
							<Glow className="inset-x-[28%] inset-y-[6%]" strength={0.3} />
						)}
						<Image
							src={heroSrc}
							alt={project.imageAlt ?? `${project.title} screenshot`}
							fill
							sizes="(min-width: 1280px) 1200px, 100vw"
							unoptimized={heroSrc.endsWith(".svg")}
							className={
								heroContain ? "object-contain py-6 px-[16%]" : "object-cover"
							}
							priority
						/>
					</div>
				) : (
					<PlaceholderTile
						label={`${project.title} — hero`}
						accent
						className="h-[300px] rounded-[20px]"
					/>
				)}

				{/* Fact cards */}
				{project.facts && project.facts.length > 0 && (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{project.facts.map((fact) => (
							<div
								key={fact.label}
								className="rounded-[18px] border border-line bg-surface p-5"
							>
								<div className="font-mono text-[10px] font-medium uppercase leading-tight tracking-[.14em] text-muted2">
									{fact.label}
								</div>
								<div className="mt-2 font-display text-[17px] leading-snug text-white">
									{fact.value}
								</div>
							</div>
						))}
					</div>
				)}

				<div className="grid gap-11 pb-12 pt-10 lg:grid-cols-[1fr_250px]">
					<div className="min-w-0">
						{/* Spec table */}
						{project.specs && project.specs.length > 0 && (
							<>
								<Eyebrow className="mb-3.5 tracking-[.14em]">
									At a glance
								</Eyebrow>
								<div className="grid gap-px overflow-hidden rounded-[14px] bg-white/[.08]">
									{project.specs.map((spec) => (
										<div
											key={spec.label}
											className="grid gap-4 bg-surface2 px-5 py-4 sm:grid-cols-[150px_1fr]"
										>
											<span className="font-mono text-[10.5px] font-medium uppercase leading-snug text-muted2">
												{spec.label}
											</span>
											<span className="text-[14.5px] leading-normal text-[#D6DBDF]">
												{spec.value}
											</span>
										</div>
									))}
								</div>
							</>
						)}

						{/* Engineering notes */}
						{project.notes && project.notes.length > 0 && (
							<>
								<Eyebrow className="mb-3.5 mt-9 tracking-[.14em]">
									Engineering notes
								</Eyebrow>
								<div className="grid gap-3 sm:grid-cols-2">
									{project.notes.map((note) => (
										<div
											key={note.title}
											className="rounded-2xl border border-line bg-surface2 p-[18px]"
										>
											<div className="text-sm font-semibold leading-snug text-fg">
												{note.title}
											</div>
											<div className="mt-1.5 text-[13px] leading-relaxed text-muted">
												{note.body}
											</div>
										</div>
									))}
								</div>
							</>
						)}

						<article className="prose prose-invert prose-quoteless mt-10 max-w-none">
							<Mdx
								code={project.body.code}
								hideImage={project.image}
								hideHeading={project.title}
							/>
						</article>
					</div>

					{/* Sidebar */}
					<aside className="grid content-start gap-5 lg:sticky lg:top-24">
						{project.portrait && (
							<div className="relative aspect-[9/19.5] overflow-hidden rounded-[20px] border border-accent/30 shadow-[0_0_40px_-14px_rgba(14,165,233,.5)]">
								<Image
									src={project.portrait}
									alt={`${project.title} portrait screenshot`}
									fill
									sizes="250px"
									className="object-cover"
								/>
							</div>
						)}
						{next && (
							<Link
								href={`/projects/${next.slug}`}
								className="block rounded-[18px] border border-accent/25 bg-tile-accent p-5 transition-colors duration-200 hover:border-accent/50"
							>
								<div className="mb-1.5 text-sm font-semibold text-fg">
									Next project
								</div>
								<div className="text-[13px] leading-relaxed text-muted">
									{next.title} &rarr;
								</div>
							</Link>
						)}
					</aside>
				</div>

				<Footer links={legalLinks} />
				<div className="h-10" />
			</main>
		</div>
	);
}
