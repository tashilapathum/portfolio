"use client";
import { useEffect } from "react";

/**
 * The page's single lamp.
 *
 * Writes `--lx` / `--ly` on the document element so every shadow recipe in
 * `global.css` re-casts together. One listener for the whole page, throttled
 * through rAF and writing straight to the DOM: never React state, and never
 * a listener per card.
 *
 * Off under a coarse pointer (there is no cursor to follow) and under
 * reduced motion, where the lamp stays at its resting angle.
 */
export function LightSource() {
	useEffect(() => {
		const fine = window.matchMedia("(pointer: fine)");
		const still = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (!fine.matches || still.matches) return;

		const root = document.documentElement;
		let frame = 0;
		let x = 0;
		let y = 0;

		const paint = () => {
			frame = 0;
			root.style.setProperty("--lx", x.toFixed(3));
			root.style.setProperty("--ly", y.toFixed(3));
		};

		const onMove = (e: PointerEvent) => {
			// Normalise to -1..1, then damp. A lamp across the room moves
			// much less than the cursor does; full range reads as a gimmick.
			x = ((e.clientX / window.innerWidth) * 2 - 1) * 0.6;
			y = ((e.clientY / window.innerHeight) * 2 - 1) * 0.6 - 0.55;
			if (!frame) frame = requestAnimationFrame(paint);
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			if (frame) cancelAnimationFrame(frame);
			root.style.removeProperty("--lx");
			root.style.removeProperty("--ly");
		};
	}, []);

	return null;
}
