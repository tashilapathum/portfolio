import Image from "next/image";
import { Metadata } from "next";
import {
	Annotation,
	Label,
	Main,
	Paper,
	SectionHead,
	Title,
} from "../components/paper";
import { SITE } from "../components/site";

export const metadata: Metadata = {
	title: "About",
	description: `${SITE.role} in ${SITE.location}. Seven years of native Android.`,
};

/** Sourced from CV.pdf. */
const TIMELINE = [
	{
		period: "2023 to now",
		title: "PAYable (Pvt) Ltd",
		body: "Senior Software Engineer since 2025, overseeing every mobile project shipped to 40k+ merchants and leading a team of five. Team Lead for Mobile 2024 to 25, owning Dynamic Currency Conversion for the POS apps. Joined 2023 as a Software Engineer on the Link Payment module, PAYable Tap for NFC, and Android apps for handheld POS devices with NFC and printing.",
	},
	{
		period: "2021 to 23",
		title: "Founder and Owner, Tantalum Technologies (Pvt) Ltd",
		body: "Full development life-cycle for 10+ clients, requirements through to Google Play. Frontend in Java and Kotlin, backend on Firebase, UI design in Adobe XD. Monetisation through Play in-app billing, ads and IdeaMart.",
	},
	{
		period: "2020 to 21",
		title: "Android Developer Intern, Epic Lanka (Pvt) Ltd",
		body: "Built demo apps, fixed bugs and shipped minor features alongside senior developers.",
	},
];

const EDUCATION = [
	{
		period: "2018 to 23",
		title: "BSc Information Technology (BIT)",
		body: "University of Colombo School of Computing",
	},
	{
		period: "2025",
		title: "EF SET English Certificate, C1 Advanced",
		body: "Equivalent to IELTS 7.0 to 8.0",
	},
	{
		period: "2020",
		title: "English for Professionals, Advanced Level",
		body: "University of Peradeniya, merit pass",
	},
];

/**
 * The pad's ruling is a 28px repeat and its margin rule sits at 55px, so
 * the body copy runs at `leading-[28px]` and starts past the margin.
 * Text that ignores the ruling underneath it makes the stock look like
 * wallpaper rather than paper someone wrote on.
 */
function Rows({
	items,
}: {
	items: { period: string; title: string; body: string }[];
}) {
	return (
		<Paper stock="pad" curl={0}>
			{/* The margin stays clear, because that is what a margin is for.
			    Everything written on the pad starts to the right of the
			    vermillion rule at 55px. */}
			<div className="py-[13px] pl-5 pr-5 sm:pl-[72px] sm:pr-8">
				{items.map((item, i) => (
					<div key={item.title} className={i === 0 ? "" : "mt-[28px]"}>
						<div className="font-mono text-[10.5px] font-medium leading-[28px] text-vermillion">
							{item.period}
						</div>
						<div className="text-[14.5px] font-semibold leading-[28px] text-graphite">
							{item.title}
						</div>
						<div className="text-[13.5px] leading-[28px] text-graphite-soft">
							{item.body}
						</div>
					</div>
				))}
			</div>
		</Paper>
	);
}

export default function AboutPage() {
	return (
		<Main className="max-w-4xl">
			<div className="flex flex-wrap items-start gap-7">
				{/* A passport photo mounted to the front of the file. */}
				<Paper curl={2} tilt={-2} className="flex-none">
					<div className="p-2 pb-5">
						<Image
							src={SITE.avatar}
							alt={SITE.fullName}
							width={96}
							height={96}
							className="block h-[96px] w-[96px] object-cover"
						/>
					</div>
				</Paper>

				<div className="pt-1">
					<Title as="h1" className="text-[34px] sm:text-[46px]">
						{SITE.fullName}
					</Title>
					<Label className="mt-3">
						{SITE.role} · {SITE.subRole} · {SITE.location}
					</Label>
				</div>
			</div>

			<p className="mt-9 max-w-[64ch] text-[15.5px] leading-loose text-graphite-soft">
				Seven years of Android, from Java and XML through Compose and
				Multiplatform, and 15+ apps shipped to over 200,000 users. I like the
				parts other people skip: drawing a whole UI on a Canvas because Material
				would not do, offline-first data, and background work that survives OEM
				battery managers.
			</p>

			<SectionHead title="Experience" className="mb-5 mt-14" />
			<Rows items={TIMELINE} />

			<SectionHead title="Education" className="mb-5 mt-14" />
			<Rows items={EDUCATION} />

			<div className="mt-14 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
				<Paper stock="card" curl={1} tilt={0.4}>
					<div className="p-5 sm:p-6">
						<Label>Right now</Label>
						<div className="mt-3 text-[14px] leading-relaxed text-graphite">
							Compose Multiplatform for a shared KMP core. Open-source Android
							libraries. Learning German.
						</div>
					</div>
				</Paper>

				<Annotation className="lg:mb-3 lg:max-w-[22ch]" tilt={-2.2}>
					The German is going slower than the KMP.
				</Annotation>
			</div>
		</Main>
	);
}
