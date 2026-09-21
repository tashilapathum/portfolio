import Link from "next/link";
import React from "react";

export type LegalLink = { label: string; href: string };

/**
 * Legal links are derived from the LegalPage documents that actually exist for
 * this project, not from the `agreements` flag. That flag used to link a Terms
 * page for projects that never had one.
 *
 * Not a `<footer>` element any more: the site has a real one now in the
 * title block, and two footer landmarks on one page is a nesting error.
 */
export const Footer: React.FC<{ links: LegalLink[] }> = ({ links }) => {
	if (links.length === 0) return null;

	return (
		<div className="mt-14 border-t border-rule/15 pt-7">
			<div className="flex flex-wrap gap-x-8 gap-y-3">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint transition-colors duration-200 hover:text-vermillion"
					>
						{link.label}
					</Link>
				))}
			</div>
		</div>
	);
};
