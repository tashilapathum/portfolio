"use client";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Sheet handling.
 *
 * Remounts its subtree on every route change so the incoming page
 * arrives tilted and slightly above the desk, then settles flat: the
 * same gesture as laying a sheet down, which is the whole thesis of
 * this design demonstrated on every navigation.
 *
 * Enter-only, deliberately. Animating the outgoing page would mean
 * holding a discarded tree alive through `LayoutRouterContext`, and
 * that hack breaks on every Next minor. The arrival carries it.
 *
 * Transform and opacity only, so this never repaints the page. It is
 * flattened by the `prefers-reduced-motion` block in `global.css`.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return (
		<div key={pathname} className="sheet-settle">
			{children}
		</div>
	);
}
