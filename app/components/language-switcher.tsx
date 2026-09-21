"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_LOCALE, nativeName } from "@/lib/i18n";

type Props = {
	/** Project slug, e.g. `neo-music`. */
	slug: string;
	/** Legal page type, e.g. `privacy` | `terms`. */
	type: string;
	/** BCP-47 codes that actually have a translation for this page. */
	available: string[];
	/** The locale currently being shown. */
	current: string;
};

export const LanguageSwitcher: React.FC<Props> = ({
	slug,
	type,
	available,
	current,
}) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click / Escape.
	useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	// Only one language available — nothing to switch to.
	if (available.length <= 1) return null;

	const select = (code: string) => {
		setOpen(false);
		if (code === current) return;
		// Remember the choice so middleware honours it on future bare-URL visits.
		document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
		const suffix = code === DEFAULT_LOCALE ? "" : `/${code}`;
		router.push(`/projects/${slug}/${type}${suffix}`);
	};

	return (
		<div ref={ref} className="relative inline-block text-left not-prose">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="cardboard inline-flex items-center gap-2 rounded-[2px] bg-paper-2 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[.14em] text-graphite [--kraft-edge:var(--graphite-faint)]"
			>
				{nativeName(current)}
			</button>

			{open && (
				<ul className="stock-tracing absolute right-0 z-50 mt-2 max-h-72 w-52 overflow-auto rounded-[3px] border border-rule/20 py-1.5 shadow-[0_14px_30px_-14px_rgb(var(--shadow-rgb)/.5)] focus:outline-none">
					{available.map((code) => (
						<li key={code}>
							<button
								type="button"
								role="option"
								aria-selected={code === current}
								onClick={() => select(code)}
								className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] transition-colors duration-150 hover:text-vermillion ${
									code === current
										? "font-semibold text-vermillion"
										: "text-graphite-soft"
								}`}
							>
								{nativeName(code)}
								{code === current && <span aria-hidden="true">&check;</span>}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
