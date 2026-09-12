import { allProjects } from "contentlayer/generated";
import { Button, TextLink } from "./ui";
import { SITE, spell } from "./site";

/** `note` is the line under the headline — it references whatever sits next to it. */
export function SiteFooter({
	note = "Case studies for the apps, libraries and client work behind the stack below.",
}: { note?: string }) {
	const count = allProjects.filter((p) => p.published).length;

	return (
		<footer className="mt-11 flex flex-wrap items-end justify-between gap-10 border-t border-line pt-8">
			<div>
				<div className="font-display text-3xl leading-tight text-fg-strong">
					{spell(count)} projects, written up.
				</div>
				<p className="mt-2.5 max-w-md text-[14.5px] leading-relaxed text-muted">
					{note}
				</p>
				<div className="mt-5 flex flex-wrap items-center gap-3">
					<Button href="/projects">Browse projects</Button>
					<Button href={SITE.resume} variant="ghost" external>
						Résumé (PDF)
					</Button>
				</div>
			</div>

			<div className="grid justify-items-start gap-2.5 sm:justify-items-end">
				<TextLink href={`mailto:${SITE.email}`}>{SITE.email}</TextLink>
				<TextLink href={SITE.links.linkedin} tone="muted">
					LinkedIn
				</TextLink>
				<TextLink href={SITE.links.github} tone="muted">
					GitHub
				</TextLink>
			</div>
		</footer>
	);
}
