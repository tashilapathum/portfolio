import { type BrandIcon, BRAND, tintOn } from "./brand-icons";

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

function Tile({ tool }: { tool: Tool }) {
	// Only the daily drivers wear their brand colour, everything else stays
	// muted, so the tile still says at a glance what I reach for every day.
	// A brand hex has to move in opposite directions on the two stocks,
	// so both values are emitted and CSS picks. See `tintOn`.
	const brand = tool.daily && tool.icon ? tintOn(tool.icon.hex) : undefined;

	return (
		// Tone carries the daily/everything-else distinction, in both
		// stocks: the daily chip is the raised tone, the rest sit flat.
		// The outline is a hairline off the rule token and is meant to be
		// barely there, which is what the light stock always looked like
		// and what the dark one now does too.
		<div
			className={`flex items-center gap-2.5 rounded-[3px] py-2 pr-3.5 ${
				tool.icon ? "pl-2" : "pl-3.5"
			} ${
				tool.daily
					? "border border-vermillion/35 bg-chip-raised"
					: "border border-rule/12 bg-chip"
			}`}
		>
			{tool.icon && (
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
					// The mark's own well is recessed relative to its chip, so
					// the icon reads as sitting IN the chip rather than as a
					// second box stacked on it. No border: two nested outlines
					// is what made these look like diagrams.
					className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[2px] text-[13px] font-semibold ${
						tool.daily
							? "brand-mark bg-chip"
							: "bg-desk-2/60 text-graphite-faint"
					}`}
				>
					<svg
						role="img"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-[17px] w-[17px]"
					>
						<title>{tool.name}</title>
						<path d={tool.icon.path} />
					</svg>
				</span>
			)}
			<span className="whitespace-nowrap text-[13.5px] font-medium text-graphite">
				{tool.name}
			</span>
		</div>
	);
}

export function Toolbox() {
	return (
		<div className="mt-6">
			{groups.map((group, i) => (
				<div
					key={group.label}
					className={`grid gap-7 py-6 md:grid-cols-[196px_1fr] ${
						i < groups.length - 1 ? "border-b border-rule/12" : ""
					}`}
				>
					<div className="font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[.16em] text-vermillion">
						{group.label}
					</div>
					<div className="flex flex-wrap content-start gap-2.5">
						{group.tools.map((tool) => (
							<Tile key={tool.name} tool={tool} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
