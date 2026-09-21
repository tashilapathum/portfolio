"use client";
import { useEffect, useRef } from "react";

/**
 * Wipes its child on, left to right, the first time it is scrolled into
 * view: the red pen actually writing the note rather than the note
 * fading in.
 *
 * The clip lives in a class this component adds on mount, so with no
 * JavaScript the note simply renders unclipped rather than staying
 * invisible forever. Reduced motion is handled in `global.css`, which
 * releases the clip outright.
 *
 * IntersectionObserver rather than a scroll listener, and it
 * disconnects after the first hit: this fires at most six times across
 * the whole site, per the handwriting budget.
 */
export function InkIn({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		el.classList.add("ink-in");

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				el.classList.add("is-written");
				observer.disconnect();
			},
			{ threshold: 0.6 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<span ref={ref} className={`inline-block ${className}`}>
			{children}
		</span>
	);
}
