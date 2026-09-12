import Image from "next/image";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "./components/nav";
import { SiteFooter } from "./components/footer";
import { Toolbox } from "./components/toolbox";
import { Button, Glow, PlaceholderTile, SectionHead } from "./components/ui";
import { SITE, STATS } from "./components/site";

export default function Home() {
	const neoMusic = allProjects.find((p) => p.slug === "neo-music");
	// The case-study hero is the loudest screen NeoMusic has — it leads here too.
	const heroShot = neoMusic?.hero ?? neoMusic?.portrait;

	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-64 right-[-120px] h-[620px] w-[900px]"
				strength={0.26}
				pulse
			/>

			<main className="relative mx-auto max-w-7xl px-6 pt-28 lg:px-12">
				{/* Hero */}
				<section className="flex flex-col gap-10 pb-16 lg:grid lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-12">
					<div className="animate-fade-in lg:col-start-1 lg:row-start-1">
						{/*
						 * The hard breaks are shaped for a wide column, so they only
						 * apply once there is one; below `sm` the line wraps itself.
						 */}
						<h1 className="m-0 font-display text-[42px] leading-[.98] -tracking-[.02em] text-fg-strong sm:text-6xl lg:text-[74px]">
							I build Android apps{" "}
							<br className="hidden sm:inline" />
							that feel{" "}
							<em className="italic text-accent [text-shadow:0_0_40px_rgba(14,165,233,.55)]">
								{" "}exciting{" "}
							</em>
							<br className="hidden sm:inline" />
							to use.
						</h1>
						<p className="mt-6 max-w-[470px] text-[17px] leading-relaxed text-muted">
							{SITE.role}. Seven years of Kotlin, Compose and Flutter, from a
							music player drawn pixel by pixel on a Canvas to the Ktor backends
							behind it.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
							<Button href="/projects" className="w-full sm:w-auto">
								See the projects
							</Button>
							<Button
								href={`mailto:${SITE.email}`}
								variant="ghost"
								className="w-full sm:w-auto"
							>
								{SITE.email}
							</Button>
						</div>
					</div>

					{/* Floating device */}
					<div className="relative flex justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
						<Glow
							className="inset-y-[-8%] inset-x-[4%]"
							strength={0.34}
							tone="crimson"
						/>
						{heroShot ? (
							<Image
								src={heroShot}
								alt="NeoMusic player screen"
								width={300}
								height={667}
								sizes="(min-width: 1024px) 300px, 220px"
								priority
								className="relative w-[220px] animate-float rounded-[28px] border border-white/10 shadow-[0_0_80px_-10px_rgba(234,51,59,.45),0_40px_80px_-30px_rgba(0,0,0,.9)] lg:w-[300px]"
							/>
						) : (
							<PlaceholderTile
								label="NeoMusic player screen"
								className="relative aspect-[9/20] w-[200px] animate-float rounded-[28px] lg:w-[272px]"
							/>
						)}
					</div>

					{/* Four stats sit as an even 2 x 2 on a phone, one row from `sm` up. */}
					<dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:flex sm:flex-wrap sm:gap-9 lg:col-start-1 lg:row-start-2">
						{STATS.map((stat) => (
							<div key={stat.label}>
								<dt className="sr-only">{stat.label}</dt>
								<dd className="m-0">
									<div className="font-display text-[34px] leading-none text-fg-strong">
										{stat.value}
									</div>
									<div className="mt-1.5 font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[.12em] text-muted2">
										{stat.label}
									</div>
								</dd>
							</div>
						))}
					</dl>
				</section>

				<SiteFooter />

				{/* Tech stack */}
				<section className="pt-14">
					<SectionHead title="Tech stack" className="mb-2.5" />
					<Toolbox />
				</section>
				<div className="h-14" />
			</main>
		</div>
	);
}
