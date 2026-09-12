import Link from "next/link";
import React from "react";

export type LegalLink = { label: string; href: string };

/**
 * Legal links are derived from the LegalPage documents that actually exist for
 * this project, not from the `agreements` flag — that flag used to link a Terms
 * page for projects that never had one.
 */
export const Footer: React.FC<{ links: LegalLink[] }> = ({ links }) => {
	if (links.length === 0) return null;

	return (
		<footer className="mt-12 border-t border-line py-8">
			<div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="font-mono text-[11px] uppercase tracking-[.16em] text-muted2 transition-colors duration-200 hover:text-accent"
					>
						{link.label}
					</Link>
				))}
			</div>
		</footer>
	);
};
