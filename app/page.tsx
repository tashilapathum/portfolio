import { Cta } from "./components/cta";
import { Toolbox } from "./components/toolbox";
import {
	Annotation,
	Button,
	DimensionString,
	ICON,
	Main,
	Photo,
	SectionHead,
	Title,
} from "./components/paper";
import { SITE, STATS } from "./components/site";

/**
 * The leader from the margin note to the print it marks.
 *
 * Red-pen markup always points at something, and the note below is
 * about the print beside it. Wide screens only: below `lg` the print
 * sits under the copy and a line across the page would be a scribble.
 *
 * The curve, both barbs of the arrowhead and the wipe are one `<path>`
 * with `pathLength={1}`, so a single dash animation draws the whole
 * gesture in order and the geometry can be retuned without touching
 * the dash maths.
 */
function Leader() {
	return (
		// rome-ignore lint/a11y/noSvgWithoutTitle: decorative, aria-hidden
		<svg
			aria-hidden="true"
			viewBox="0 0 380 72"
			fill="none"
			className="pointer-events-none absolute left-full top-1/2 hidden h-[72px] w-[380px] -translate-y-1/2 overflow-visible text-vermillion lg:block"
		>
			<path
				className="leader"
				pathLength={1}
				d="M4 40 C 78 41, 158 38, 236 29 C 284 23, 318 18, 352 11 M352 11 l -12 0.6 M352 11 l -7 9.5"
				stroke="currentColor"
				strokeWidth={1.3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

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
						music player drawn pixel by pixel on a Canvas to an AI chatbot with
						a Ktor + Supabase backend behind it.
					</p>

					<div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
						<Button
							href="/projects"
							icon={ICON.folder}
							className="w-full sm:w-auto"
						>
							See the projects
						</Button>
						<Button
							href={`mailto:${SITE.email}`}
							variant="quiet"
							icon={ICON.mail}
							className="w-full sm:w-auto"
						>
							{SITE.email}
						</Button>
					</div>

					{/* In the first viewport, so the wipe runs off a cue
					    rather than an observer: scrolled-into-view fires on
					    mount here, before anyone has looked at the page.
					    Last beat of the arrival, just after the leader. */}
					<div className="relative ml-1 mt-8 inline-block">
						<Leader />
						<Annotation tilt={-1.8} delay={1050}>
							the Canvas one is still my favourite
						</Annotation>
					</div>
				</div>

				<Photo
					src="/hero.png"
					alt="NeoMusic player screen"
					mount="tape"
					caption="NeoMusic · visualiser drawn per frame on a Canvas"
					arrive
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
			 * Dimensioned, not tiled. Four numerals over a hairline is the
			 * most-shipped block on the web; these are figures taken off a
			 * drawing, which is the only kind of number this design has.
			 */}
			<DimensionString items={STATS} className="mt-16 sm:mt-20" />

			<Cta />

			<section className="pt-20">
				<SectionHead title="Tech stack" className="mb-8" />
				<Toolbox />
			</section>
		</Main>
	);
}
