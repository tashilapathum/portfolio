"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SITE } from "./site";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Projects", href: "/projects" },
	{ name: "About", href: "/about" },
	{ name: "Blog", href: "/blog" },
	{ name: "Contact", href: "/contact" },
];

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	// Close the mobile sheet whenever the route changes.
	useEffect(() => setMenuOpen(false), [pathname]);

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : pathname?.startsWith(href);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${
					isIntersecting
						? "border-transparent bg-ink/0"
						: "border-line bg-ink/80"
				}`}
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
					<Link href="/" className="group flex items-center gap-2.5">
						<Image
							src={SITE.avatar}
							alt=""
							width={28}
							height={28}
							priority
							className="h-7 w-7 rounded-full border border-line-strong transition-transform duration-300 group-hover:scale-105"
						/>
						<span className="whitespace-nowrap text-sm font-semibold -tracking-[.01em] text-fg-strong">
							{SITE.name}
						</span>
					</Link>

					{/* Desktop */}
					<nav className="hidden items-center gap-7 md:flex">
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`border-b-2 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-[.16em] transition-colors duration-200 ${
									isActive(item.href)
										? "border-accent text-white"
										: "border-transparent text-muted hover:text-fg"
								}`}
							>
								{item.name}
							</Link>
						))}
						<a
							href="/CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="whitespace-nowrap rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink shadow-accent-glow transition-colors duration-200 hover:bg-accent-soft"
						>
							Résumé
						</a>
					</nav>

					{/* Mobile trigger */}
					<button
						type="button"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen((o) => !o)}
						className="grid gap-[5px] p-2.5 md:hidden"
					>
						<span
							className={`block h-[1.5px] w-5 bg-muted transition-transform duration-300 ${
								menuOpen ? "translate-y-[3.25px] rotate-45" : ""
							}`}
						/>
						<span
							className={`block h-[1.5px] w-5 bg-muted transition-transform duration-300 ${
								menuOpen ? "-translate-y-[3.25px] -rotate-45" : ""
							}`}
						/>
					</button>
				</div>

				{/*
				 * The sheet stays mounted and animates a grid row from 0fr to 1fr, so
				 * it eases open at its natural height without a magic max-height.
				 */}
				<div
					aria-hidden={!menuOpen}
					className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
						menuOpen
							? "grid-rows-[1fr] opacity-100"
							: "pointer-events-none grid-rows-[0fr] opacity-0"
					}`}
				>
					<div className="overflow-hidden">
						<nav className="border-t border-line bg-ink/95 px-6 py-5">
							<div className="grid gap-4">
								{navigation.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										tabIndex={menuOpen ? undefined : -1}
										className={`font-mono text-xs uppercase tracking-[.16em] transition-colors duration-200 ${
											isActive(item.href) ? "text-accent" : "text-muted"
										}`}
									>
										{item.name}
									</Link>
								))}
								<a
									href="/CV.pdf"
									target="_blank"
									rel="noopener noreferrer"
									tabIndex={menuOpen ? undefined : -1}
									className="mt-2 rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-soft"
								>
									Résumé
								</a>
							</div>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
};
