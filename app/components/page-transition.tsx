"use client";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Remounts its subtree on every route change so the incoming page fades and
 * rises in rather than blinking into place. Flattened by the
 * prefers-reduced-motion block in global.css.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return (
		<div key={pathname} className="animate-rise-in">
			{children}
		</div>
	);
}
