"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tab, TabStrip } from "./paper";
import { ThemeToggle } from "./theme-toggle";
import { SITE } from "./site";

/**
 * The site is the folder and the routes are its tabs.
 *
 * The active tab is the same piece of card as the folder edge below it,
 * which is the whole reason this shape earns its place over a row of
 * links. See the folder recipes in `global.css`.
 *
 * On a phone the tab row scrolls sideways rather than collapsing into a
 * hamburger: five tabs fit a thumb-swipe, and a sheet that slides over
 * the page to show five links is more machinery than the job needs.
 */
const ROUTES = [
	{ name: "Home", href: "/" },
	{ name: "Projects", href: "/projects" },
	{ name: "About", href: "/about" },
	{ name: "Blog", href: "/blog" },
	{ name: "Contact", href: "/contact" },
];

export function SiteNav() {
	const sentinel = useRef<HTMLDivElement>(null);
	const [atTop, setAtTop] = useState(true);
	const pathname = usePathname();

	// Once the strip sticks, it needs a ground of its own or the page
	// scrolls through it. Tracing paper, so what passes under still reads.
	useEffect(() => {
		const el = sentinel.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) =>
			setAtTop(entry.isIntersecting),
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href));

	return (
		<>
			<div ref={sentinel} aria-hidden="true" className="h-px" />
			<header
				className={`sticky top-0 z-50 transition-colors duration-300 ${
					atTop ? "" : "stock-tracing"
				}`}
			>
				<div className="mx-auto max-w-6xl px-5 pt-3 sm:px-6 lg:px-10">
					<div className="flex items-end justify-between gap-4 pb-1.5">
						<Link href="/" className="group flex items-center gap-2.5">
							<Image
								src={SITE.avatar}
								alt=""
								width={26}
								height={26}
								priority
								className="h-[26px] w-[26px] rounded-full border border-rule/20 transition-transform duration-300 group-hover:scale-105"
							/>
							<span className="whitespace-nowrap font-title text-[13px] font-bold uppercase tracking-[-.01em] text-graphite">
								{SITE.name}
							</span>
						</Link>

						<div className="flex items-center gap-4">
							<a
								href={SITE.resume}
								target="_blank"
								rel="noopener noreferrer"
								className="hidden font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint transition-colors duration-200 hover:text-vermillion sm:block"
							>
								Résumé
							</a>
							<ThemeToggle />
						</div>
					</div>

					<TabStrip>
						{ROUTES.map((route) => (
							<Tab
								key={route.href}
								href={route.href}
								active={isActive(route.href)}
							>
								{route.name}
							</Tab>
						))}
					</TabStrip>
				</div>
			</header>
		</>
	);
}
