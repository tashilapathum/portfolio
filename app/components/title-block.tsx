import { allProjects } from "contentlayer/generated";
import { SITE } from "./site";

/**
 * The site footer as a drafting title block.
 *
 * Every real drafting sheet carries one of these in its corner: who
 * drew it, what it is, what scale, which revision. It is the one piece
 * of furniture this design has that nothing else does, so the fields
 * have to be true. Nothing here is invented, and there is deliberately
 * no build number or version stamp: those are CLI fixtures, not
 * something a drawing carries.
 */

/** The revision is the month the content last changed, not a build id. */
const REVISION = new Intl.DateTimeFormat("en-CA", {
	year: "numeric",
	month: "2-digit",
}).format(new Date());

function Field({
	label,
	children,
}: { label: string; children: React.ReactNode }) {
	return (
		<div className="px-3.5 py-2.5">
			<div className="font-mono text-[9px] uppercase tracking-[.2em] text-graphite-faint">
				{label}
			</div>
			<div className="mt-1 font-mono text-[12px] leading-tight text-graphite">
				{children}
			</div>
		</div>
	);
}

export function TitleBlock() {
	const published = allProjects.filter((p) => p.published).length;

	return (
		<footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-16 sm:px-6 sm:pb-14 lg:px-10">
			<div className="title-block grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
				<Field label="Drawn by">{SITE.name}</Field>
				<Field label="Discipline">{SITE.subRole}</Field>
				<Field label="Sheets">{published} projects</Field>
				<Field label="Scale">1:1</Field>
				<Field label="Rev">{REVISION}</Field>
			</div>

			<nav className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint">
				<a
					href={`mailto:${SITE.email}`}
					className="transition-colors duration-200 hover:text-vermillion"
				>
					{SITE.email}
				</a>
				<a
					href={SITE.links.github}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors duration-200 hover:text-vermillion"
				>
					GitHub
				</a>
				<a
					href={SITE.links.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors duration-200 hover:text-vermillion"
				>
					LinkedIn
				</a>
				<a
					href={SITE.links.playStore}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors duration-200 hover:text-vermillion"
				>
					Play Store
				</a>
				{/* A title block names the office that drew the sheet. It is
				    not an atmospheric locale strip, so it carries no time
				    and no weather. */}
				<span className="ml-auto">{SITE.location}</span>
			</nav>
		</footer>
	);
}
