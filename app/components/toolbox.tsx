import React from "react";
import { type BrandIcon, BRAND, tintOn } from "./brand-icons";
import { Paper } from "./paper";

type Tool = { name: string; icon?: BrandIcon; daily?: boolean };
type Group = { label: string; tools: Tool[] };

/**
 * A tool with no brand mark to source, like the MVVM pattern or the Room library,
 * renders as a plain name pill with no logo square.
 */
const groups: Group[] = [
	{
		label: "Native Android",
		tools: [
			{ name: "Kotlin", icon: BRAND.kotlin, daily: true },
			{
				name: "Jetpack Compose",
				icon: BRAND.jetpackCompose,
				daily: true,
			},
			{ name: "Compose Canvas", daily: true },
			{ name: "Media3", daily: true },
			{ name: "Room" },
			{ name: "Coroutines" },
			{ name: "WorkManager" },
			{ name: "Koin" },
			{ name: "Material 3", icon: BRAND.material },
			{ name: "Java", icon: BRAND.java },
			{ name: "Gradle", icon: BRAND.gradle },
		],
	},
	{
		label: "Cross-platform",
		tools: [
			{ name: "Flutter", icon: BRAND.flutter, daily: true },
			{ name: "Dart", icon: BRAND.dart, daily: true },
			{ name: "Compose Multiplatform" },
			{ name: "Swift", icon: BRAND.swift },
			{ name: "Objective-C" },
		],
	},
	{
		label: "Backend & cloud",
		tools: [
			{ name: "Ktor", icon: BRAND.ktor, daily: true },
			{ name: "Supabase", icon: BRAND.supabase, daily: true },
			{ name: "Firebase", icon: BRAND.firebase, daily: true },
			{ name: "PostgreSQL", icon: BRAND.postgresql },
			{ name: "Google Cloud", icon: BRAND.googleCloud },
			{ name: "Render", icon: BRAND.render },
			{ name: "Vercel", icon: BRAND.vercel },
		],
	},
	{
		label: "Architecture",
		tools: [
			{ name: "MVVM", daily: true },
			{ name: "Clean Architecture", daily: true },
			{ name: "Multi-module" },
			{ name: "Offline-first" },
			{ name: "Dependency injection" },
		],
	},
	{
		label: "Web & tools",
		tools: [
			{ name: "Next.js", icon: BRAND.nextjs },
			{ name: "TailwindCSS", icon: BRAND.tailwind },
			{ name: "Jira", icon: BRAND.jira },
			{ name: "GitHub Actions", icon: BRAND.githubActions },
		],
	},
];

/**
 * One entry in the schedule: the mark, the name, and a vermillion dot
 * on the things I actually reach for.
 *
 * No chip. A specification schedule has rows, and a wall of pills is
 * the single most templated block on a portfolio; the dot and the
 * hairline between entries do the same work without the plastic.
 */
function Entry({ tool }: { tool: Tool }) {
	// Only the daily drivers wear their brand colour, everything else stays
	// muted, so the row still says at a glance what I reach for every day.
	// A brand hex has to move in opposite directions on the two stocks,
	// so both values are emitted and CSS picks. See `tintOn`.
	const brand = tool.daily && tool.icon ? tintOn(tool.icon.hex) : undefined;

	return (
		// ONE mark slot, and it is never empty. Reserving separate slots
		// for a dot and a brand mark lined the names up but left rows like
		// "Room" with two holes where their neighbours have two glyphs,
		// and a ragged column of furniture reads as misalignment even when
		// the type is flush. So every entry puts exactly one thing here: a
		// brand mark where there is one, and a filled square where there
		// is none, coloured by the same daily rule.
		<span className="flex items-start gap-2.5">
			<span
				aria-hidden="true"
				style={
					brand
						? ({
								"--brand-on-light": brand.onLight,
								"--brand-on-dark": brand.onDark,
						  } as React.CSSProperties)
						: undefined
				}
				className={`mt-[2px] flex h-[15px] w-[15px] flex-none items-center justify-center ${
					tool.daily ? "brand-mark" : "text-graphite-faint"
				}`}
			>
				{tool.icon ? (
					<svg role="img" viewBox="0 0 24 24" fill="currentColor">
						<title>{tool.name}</title>
						<path d={tool.icon.path} />
					</svg>
				) : (
					// No brand mark to source, so the slot gets a filled
					// square instead. Colour carries the same signal it does
					// on a real mark, per the legend.
					<span
						className={`block h-2 w-2 rounded-[1px] ${
							tool.daily ? "bg-vermillion" : "bg-rule/25"
						}`}
					/>
				)}
			</span>
			{/* Wraps rather than truncates. Two columns at 390px are
			    narrower than "Dependency injection", and the name is the
			    content: an ellipsis here loses the entry. */}
			<span
				className={`min-w-0 text-[13.5px] leading-snug ${
					tool.daily ? "font-medium text-graphite" : "text-graphite-soft"
				}`}
			>
				{tool.name}
			</span>
		</span>
	);
}

/**
 * The stack as a specification schedule, pinned flat to the board.
 *
 * Graph stock is this system's convention for anything technical
 * (CLAUDE.md, Materials) and curl 0 is the pinned level, which is
 * what a schedule on a drawing board actually is. The row rhythm is a
 * multiple of the stock's 22px ruling, or the two grids beat.
 */
export function Toolbox() {
	return (
		<Paper stock="graph" curl={0} className="mt-6">
			<div className="px-5 py-[11px] sm:px-[22px]">
				{groups.map((group, i) => (
					<div
						key={group.label}
						className={`grid gap-y-3 py-[11px] md:grid-cols-[168px_minmax(0,1fr)] ${
							i < groups.length - 1 ? "border-b border-rule/12" : ""
						}`}
					>
						<div className="pt-[3px] font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[.16em] text-vermillion">
							{group.label}
						</div>
						{/* A column grid, not a wrapped run. Entries line up down
					    the sheet the way a parts list does, and a wrapped run
					    puts a stray separator at the head of its second line. */}
						<div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4 md:border-l md:border-rule/12 md:pl-7">
							{group.tools.map((tool) => (
								<Entry key={tool.name} tool={tool} />
							))}
						</div>
					</div>
				))}
			</div>

			<div className="border-t border-rule/12 px-5 py-[11px] font-mono text-[10px] uppercase tracking-[.16em] text-graphite-faint sm:px-[22px]">
				<span
					aria-hidden="true"
					className="mr-2 inline-block h-2 w-2 rounded-[1px] bg-vermillion align-[-1px]"
				/>
				Marks in colour are daily drivers
			</div>
		</Paper>
	);
}
