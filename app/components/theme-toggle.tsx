"use client";
import { useEffect, useState } from "react";

type Stock = "light" | "dark";

/**
 * Swaps the paper stock. Not a sun/moon switch: the control shows the two
 * stocks themselves, manila and blueprint, and you pick one.
 *
 * With nothing stored the site follows the system and keeps following it
 * live. Choosing a stock stores it and that choice wins from then on.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
	const [stock, setStock] = useState<Stock | null>(null);

	// The inline script in `layout.tsx` has already set the attribute, so
	// this only syncs React up to what is on screen.
	useEffect(() => {
		setStock(
			document.documentElement.dataset.theme === "dark" ? "dark" : "light",
		);

		const system = window.matchMedia("(prefers-color-scheme: dark)");
		const follow = (e: MediaQueryListEvent) => {
			if (localStorage.getItem("theme")) return; // an explicit choice wins
			const next: Stock = e.matches ? "dark" : "light";
			document.documentElement.dataset.theme = next;
			setStock(next);
		};
		system.addEventListener("change", follow);
		return () => system.removeEventListener("change", follow);
	}, []);

	const choose = (next: Stock) => {
		document.documentElement.dataset.theme = next;
		setStock(next);
		try {
			localStorage.setItem("theme", next);
		} catch {
			// Private mode. The choice just will not survive a reload.
		}
	};

	const swatch = (value: Stock, label: string, swatchClass: string) => {
		const active = stock === value;
		return (
			<button
				type="button"
				onClick={() => choose(value)}
				aria-pressed={active}
				aria-label={label}
				title={label}
				className={`h-6 w-6 border transition-transform duration-150 hover:-translate-y-px ${swatchClass} ${
					active
						? "border-vermillion shadow-[0_0_0_1px_rgb(var(--vermillion))]"
						: "border-graphite/25 opacity-60 hover:opacity-90"
				}`}
			/>
		);
	};

	return (
		<div
			className={`inline-flex items-center gap-1.5 ${className}`}
			// Before mount the stock is unknown, so neither swatch is marked
			// active. Hiding it until then avoids a visible correction.
			style={{ visibility: stock ? "visible" : "hidden" }}
		>
			{swatch("light", "Manila paper", "bg-[rgb(245_241_232)]")}
			{swatch("dark", "Blueprint", "bg-[rgb(19_43_78)]")}
		</div>
	);
}
