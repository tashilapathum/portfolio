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
 *
 * `delay` swaps the observer for a timer. A note already in the first
 * viewport has nothing to scroll into, so the observer fires on mount,
 * before anyone has looked at the page; a note that is one beat of a
 * choreographed arrival needs to wait for its cue instead.
 */
export function InkIn({
	children,
	className = "",
	delay,
}: {
	children: React.ReactNode;
	className?: string;
	/** Milliseconds from mount. Omit to wipe on when scrolled into view. */
	delay?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		el.classList.add("ink-in");

		if (delay !== undefined) {
			// Measured from navigation, not from mount. Every other beat of
			// an arrival is a CSS animation on the document's own clock, and
			// hydration can land well after all of them: counting from mount
			// would leave the leader line pointing at a note that has not
			// been written yet. A late hydrate simply writes it at once.
			const wait = Math.max(0, delay - performance.now());
			const timer = setTimeout(() => el.classList.add("is-written"), wait);
			return () => clearTimeout(timer);
		}

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
	}, [delay]);

	return (
		<span ref={ref} className={`inline-block ${className}`}>
			{children}
		</span>
	);
}
