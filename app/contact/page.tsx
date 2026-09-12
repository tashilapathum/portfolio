import { Github, Linkedin, Mail, Smartphone } from "lucide-react";
import { Metadata } from "next";
import { Navigation } from "../components/nav";
import { Glow } from "../components/ui";
import { SITE } from "../components/site";

export const metadata: Metadata = {
	title: "Contact",
	description: `Get in touch with ${SITE.name}.`,
};

const channels = [
	{
		icon: Mail,
		href: `mailto:${SITE.email}`,
		handle: SITE.email,
		label: "Email",
		primary: true,
	},
	{
		icon: Linkedin,
		href: SITE.links.linkedin,
		handle: SITE.name,
		label: "LinkedIn",
	},
	{
		icon: Github,
		href: SITE.links.github,
		handle: "tashilapathum",
		label: "GitHub",
	},
	{
		icon: Smartphone,
		href: SITE.links.playStore,
		handle: "15+ apps",
		label: "Google Play developer page",
	},
];

export default function ContactPage() {
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Navigation />
			<Glow
				className="bottom-[-190px] left-1/2 h-[380px] w-[520px] -translate-x-1/2"
				strength={0.26}
				pulse
			/>

			<main className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-28">
				<h1 className="m-0 font-display text-4xl leading-tight text-fg-strong sm:text-[42px]">
					Say hello.
				</h1>
				<p className="mb-7 mt-3 text-[14.5px] leading-relaxed text-muted">
					Roles, collaborations or a question about a project.
				</p>

				<div className="grid gap-2.5">
					{channels.map((c) => {
						const Icon = c.icon;
						return (
							<a
								key={c.href}
								href={c.href}
								target={c.href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noopener noreferrer"
								className={`flex items-center gap-3.5 rounded-2xl p-[18px] transition-colors duration-200 ${
									c.primary
										? "border border-accent/30 bg-tile-accent shadow-[0_0_40px_-18px_rgba(14,165,233,.8)] hover:border-accent/60"
										: "border border-line bg-surface hover:border-line-strong"
								}`}
							>
								<span
									className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl ${
										c.primary
											? "bg-accent/20 text-accent-soft"
											: "bg-white/[.07] text-muted"
									}`}
								>
									<Icon size={18} />
								</span>
								<span>
									<span className="block text-sm font-semibold leading-snug text-fg">
										{c.handle}
									</span>
									<span
										className={`mt-0.5 block font-mono text-xs leading-snug ${
											c.primary ? "text-accent-soft" : "text-muted2"
										}`}
									>
										{c.label}
									</span>
								</span>
							</a>
						);
					})}
				</div>
			</main>
		</div>
	);
}
