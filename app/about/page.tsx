import Image from "next/image";
import { Metadata } from "next";
import { Navigation } from "../components/nav";
import { SiteFooter } from "../components/footer";
import { Glow } from "../components/ui";
import { SITE } from "../components/site";

export const metadata: Metadata = {
	title: "About",
	description: `${SITE.role} in ${SITE.location}. Seven years of native Android.`,
};

/** Sourced from CV.pdf. */
const timeline = [
	{
		period: "2023 —",
		title: "PAYable (Pvt) Ltd",
		body: "Senior Software Engineer since 2025 — overseeing every mobile project shipped to 40k+ merchants and leading a team of five. Team Lead for Mobile 2024–25, owning Dynamic Currency Conversion for the POS apps. Joined 2023 as a Software Engineer on the Link Payment module, PAYable Tap for NFC, and Android apps for handheld POS devices with NFC and printing.",
	},
	{
		period: "2021 — 23",
		title: "Founder & Owner, Tantalum Technologies (Pvt) Ltd",
		body: "Full development life-cycle for 10+ clients — requirements through to Google Play. Frontend in Java and Kotlin, backend on Firebase, UI design in Adobe XD. Monetisation through Play in-app billing, ads and IdeaMart.",
	},
	{
		period: "2020 — 21",
		title: "Android Developer Intern, Epic Lanka (Pvt) Ltd",
		body: "Built demo apps, fixed bugs and shipped minor features alongside senior developers.",
	},
];

const education = [
	{
		period: "2018 — 23",
		title: "BSc Information Technology (BIT)",
		body: "University of Colombo School of Computing",
	},
	{
		period: "2025",
		title: "EF SET English Certificate — C1 Advanced",
		body: "Equivalent to IELTS 7.0–8.0",
	},
	{
		period: "2020",
		title: "English for Professionals — Advanced Level",
		body: "University of Peradeniya · merit pass",
	},
];

function Rows({
	items,
}: {
	items: { period: string; title: string; body: string }[];
}) {
	return (
		<div className="border-t border-line">
			{items.map((item, i) => (
				<div
					key={item.title}
					className={`grid gap-5 py-[18px] sm:grid-cols-[96px_1fr] ${
						i < items.length - 1 ? "border-b border-line" : ""
					}`}
				>
					<span className="font-mono text-[11px] font-medium leading-snug text-accent">
						{item.period}
					</span>
					<div>
						<div className="text-[14.5px] font-semibold leading-snug text-fg">
							{item.title}
						</div>
						<div className="mt-1 text-[13.5px] leading-relaxed text-muted">
							{item.body}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default function AboutPage() {
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="-top-40 right-[-120px] h-[380px] w-[520px]"
				strength={0.2}
			/>

			<main className="relative mx-auto max-w-3xl px-6 pt-28 lg:px-12">
				<div className="flex flex-wrap items-start gap-6">
					<Image
						src={SITE.avatar}
						alt={SITE.fullName}
						width={92}
						height={92}
						className="h-[92px] w-[92px] flex-none rounded-[26px] border border-white/10 object-cover"
					/>
					<div>
						<h1 className="m-0 font-display text-4xl leading-tight text-fg-strong sm:text-[44px]">
							{SITE.fullName}
						</h1>
						<p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
							{SITE.role} · {SITE.subRole} · {SITE.location} · builds in Kotlin,
							ships on Play, writes the backend too.
						</p>
					</div>
				</div>

				<p className="mt-8 text-[15.5px] leading-loose text-[#A9B1B7]">
					Seven years of Android, from Java and XML through Compose and
					Multiplatform, and 15+ apps shipped to over 200,000 users. I like the
					parts other people skip: drawing a whole UI on a Canvas because
					Material wouldn't do, offline-first data, and background work that
					survives OEM battery managers.
				</p>

				<h2 className="mb-4 mt-10 font-mono text-[10.5px] font-medium uppercase tracking-[.16em] text-muted2">
					Experience
				</h2>
				<Rows items={timeline} />

				<h2 className="mb-4 mt-10 font-mono text-[10.5px] font-medium uppercase tracking-[.16em] text-muted2">
					Education & certificates
				</h2>
				<Rows items={education} />

				<div className="mt-8 rounded-2xl border border-accent/25 bg-tile-accent p-5">
					<div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-[.14em] text-accent-soft">
						Right now
					</div>
					<div className="text-sm leading-relaxed text-[#D6DBDF]">
						Compose Multiplatform for a shared KMP core · Open-source Android libraries · learning German.
					</div>
				</div>

				<div className="h-14" />
			</main>
		</div>
	);
}
