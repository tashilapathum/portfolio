import { Cta } from "./components/cta";
import { Toolbox } from "./components/toolbox";
import {
	Annotation,
	Button,
	Main,
	Photo,
	SectionHead,
	Title,
} from "./components/paper";
import { SITE, STATS } from "./components/site";

export default function Home() {
	return (
		<Main>
			{/*
			 * `minmax(0, …)` on both columns, not bare `fr`. An `fr` track
			 * floors at its content's min-content width, and a 74px
			 * uppercase headline has a very large one: it ate the whole row
			 * and crushed the photo column to 21 pixels.
			 */}
			<section className="grid items-center gap-12 pb-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-16">
				<div>
					{/*
					 * Scale is planned against the print beside it. At 74px
					 * this nine-word headline ran six lines in its column;
					 * a hero headline gets two.
					 */}
					<Title as="h1" className="text-[36px] sm:text-[46px] lg:text-[54px]">
						I build Android apps that feel{" "}
						<em className="not-italic text-vermillion">exciting</em> to use.
					</Title>

					<p className="mt-7 max-w-[46ch] text-[16.5px] leading-relaxed text-graphite-soft">
						{SITE.role}. Seven years of Kotlin, Compose and Flutter, from a
						music player drawn pixel by pixel on a Canvas to the Ktor backends
						behind it.
					</p>

					<div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
						<Button href="/projects" className="w-full sm:w-auto">
							See the projects
						</Button>
						<Button
							href={`mailto:${SITE.email}`}
							variant="quiet"
							className="w-full sm:w-auto"
						>
							{SITE.email}
						</Button>
					</div>

					{/* In the first viewport, so it does not wipe on: the
					    animation would finish before anyone looked at it. */}
					<Annotation className="ml-1 mt-8" tilt={-1.8} write={false}>
						the Canvas one is still my favourite
					</Annotation>
				</div>

				<Photo
					src="/hero.png"
					alt="NeoMusic player screen"
					mount="tape"
					aspect="aspect-[1020/1123]"
					sizes="(min-width: 1024px) 460px, 100vw"
					tilt={1.4}
					// `w-full` is load-bearing next to `mx-auto`. An auto
					// margin stops a grid item stretching to its area, so the
					// print sized to its content instead, and an aspect-ratio
					// box holding a `fill` image has no intrinsic width: it
					// collapsed to its own padding, 21 pixels.
					className="w-full max-w-[420px] mx-auto lg:max-w-none"
					priority
				/>
			</section>

			{/*
			 * Printed straight on the desk, not boxed. Four numbers do not
			 * need four cards, and a row of tiles here would compete with
			 * the print beside it.
			 */}
			<dl className="m-0 mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-rule/15 pt-9 sm:flex sm:flex-wrap sm:gap-12">
				{STATS.map((stat) => (
					<div key={stat.label}>
						<dt className="sr-only">{stat.label}</dt>
						<dd className="m-0">
							<div className="font-title text-[34px] font-extrabold leading-none tracking-[-.02em] text-graphite">
								{stat.value}
							</div>
							<div className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-[.16em] text-graphite-faint">
								{stat.label}
							</div>
						</dd>
					</div>
				))}
			</dl>

			<Cta />

			<section className="pt-20">
				<SectionHead title="Tech stack" className="mb-8" />
				<Toolbox />
			</section>
		</Main>
	);
}
