"use client";

import { Check, Globe } from "lucide-react";
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

export const LanguageSwitcher: React.FC<Props> = ({ slug, type, available, current }) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click / Escape.
	useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
				className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm duration-200 hover:bg-zinc-50 hover:text-zinc-900"
			>
				<Globe className="h-4 w-4" />
				{nativeName(current)}
			</button>

			{open && (
				<ul
					role="listbox"
					className="absolute right-0 z-50 mt-2 max-h-72 w-48 overflow-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg focus:outline-none"
				>
					{available.map((code) => (
						<li key={code}>
							<button
								type="button"
								role="option"
								aria-selected={code === current}
								onClick={() => select(code)}
								className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm duration-150 hover:bg-zinc-100 ${
									code === current ? "font-semibold text-zinc-900" : "text-zinc-700"
								}`}
							>
								{nativeName(code)}
								{code === current && <Check className="h-4 w-4" />}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
