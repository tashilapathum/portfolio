import { allProjects } from "contentlayer/generated";
import { Button, Title } from "./paper";
import { SITE, spell } from "./site";

/**
 * A mid-page call to action, used on the home page.
 *
 * This was called `SiteFooter` and was never a footer: it sits in the
 * middle of a page and the site's real footer is the title block. The
 * name cost a dead import in `about/page.tsx` and a second `<footer>`
 * landmark on every page that rendered it.
 *
 * `note` is the line under the headline; it references whatever sits
 * next to it on the page, so the caller owns it.
 */
export function Cta({
	note = "Case studies for the apps, libraries and client work behind the stack below.",
}: { note?: string }) {
	const count = allProjects.filter((p) => p.published).length;

	return (
		<section className="mt-20 flex flex-wrap items-end justify-between gap-10 border-t border-rule/15 pt-10">
			<div>
				<Title className="text-[28px] sm:text-[36px]">
					{spell(count)} projects, written up.
				</Title>
				<p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-graphite-soft">
					{note}
				</p>
				<div className="mt-7 flex flex-wrap items-center gap-3.5">
					<Button href="/projects">Browse projects</Button>
					<Button href={SITE.resume} variant="quiet" external>
						Résumé (PDF)
					</Button>
				</div>
			</div>

			<div className="grid justify-items-start gap-3 font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint sm:justify-items-end">
				<a
					href={`mailto:${SITE.email}`}
					className="transition-colors duration-200 hover:text-vermillion"
				>
					{SITE.email}
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
					href={SITE.links.github}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors duration-200 hover:text-vermillion"
				>
					GitHub
				</a>
			</div>
		</section>
	);
}
