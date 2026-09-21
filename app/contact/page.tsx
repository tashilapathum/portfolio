import { Metadata } from "next";
import { Annotation, Label, Main, Paper, Title } from "../components/paper";
import { SITE } from "../components/site";

export const metadata: Metadata = {
	title: "Contact",
	description: `Get in touch with ${SITE.name}.`,
};

/**
 * No icons here on purpose. A drafting sheet labels a thing in words;
 * a little glyph in a rounded chip is the vocabulary of a different
 * design, and it was the only reason this page pulled in lucide.
 */
const CHANNELS = [
	{ href: SITE.links.linkedin, handle: SITE.name, label: "LinkedIn" },
	{ href: SITE.links.github, handle: "tashilapathum", label: "GitHub" },
	{
		href: SITE.links.playStore,
		handle: "Tashila Pathum",
		label: "Google Play",
	},
];

export default function ContactPage() {
	return (
		<Main className="max-w-3xl">
			<Title as="h1" className="text-[38px] sm:text-[52px]">
				Say hello.
			</Title>
			<p className="mb-10 mt-4 max-w-[46ch] text-[15px] leading-relaxed text-graphite-soft">
				Roles, collaborations, or a question about a project.
			</p>

			{/* Email is the one thing on this page anyone actually wants, so
			    it gets a sheet of its own rather than a slot in a grid. */}
			<Paper curl={2} tilt={-0.4}>
				<a
					href={`mailto:${SITE.email}`}
					className="block p-6 sm:p-8"
					aria-label={`Email ${SITE.email}`}
				>
					<Label>Email</Label>
					<div className="mt-3 break-words font-title text-[26px] font-extrabold uppercase leading-none tracking-[-.02em] text-graphite sm:text-[34px]">
						{SITE.email}
					</div>
					<div className="mt-4 font-mono text-[11px] uppercase tracking-[.16em] text-vermillion">
						Write to me
					</div>
				</a>
			</Paper>

			<Annotation className="ml-1 mt-6" tilt={-1.6}>
				I read all of it. I reply to most of it.
			</Annotation>

			<div className="mt-10 grid gap-5 sm:grid-cols-3">
				{CHANNELS.map((channel, i) => (
					<Paper key={channel.href} stock="card" tilt={[-0.5, 0.4, -0.3][i]}>
						<a
							href={channel.href}
							target="_blank"
							rel="noopener noreferrer"
							className="block p-5"
						>
							<Label>{channel.label}</Label>
							<div className="mt-2.5 text-[14px] leading-snug text-graphite">
								{channel.handle}
							</div>
						</a>
					</Paper>
				))}
			</div>
		</Main>
	);
}
