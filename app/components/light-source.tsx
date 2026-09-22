"use client";
import { useEffect } from "react";

/** The lamp's resting angle, matching the `--lx` / `--ly` defaults. */
const REST_X = -0.35;
const REST_Y = -1;

/** When the sweep starts, and how long it takes. See the arrival in `global.css`. */
const SWEEP_DELAY = 1200;
const SWEEP_MS = 1500;

/**
 * The page's single lamp.
 *
 * Writes `--lx` / `--ly` on the document element so every shadow recipe in
 * `global.css` re-casts together. One listener for the whole page, throttled
 * through rAF and writing straight to the DOM: never React state, and never
 * a listener per card.
 *
 * On load it sweeps once, unprompted. The lamp is the most distinctive thing
 * this system does and it was invisible until a visitor happened to move the
 * pointer, which on a phone is never and on a desktop is a coin toss. One
 * pass across the desk and back to rest shows every shadow on the page turn
 * together, and then the cursor has it.
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
		let sweep = 0;
		let sweepFrom = 0;
		// The moment a real pointer event arrives the sweep is over for
		// good. A lamp that keeps drifting while you move the mouse reads
		// as a bug, not as a lamp.
		let taken = false;
		let x = REST_X;
		let y = REST_Y;

		const write = () => {
			root.style.setProperty("--lx", x.toFixed(3));
			root.style.setProperty("--ly", y.toFixed(3));
		};

		const paint = () => {
			frame = 0;
			write();
		};

		const onMove = (e: PointerEvent) => {
			if (!taken) {
				taken = true;
				if (sweep) cancelAnimationFrame(sweep);
				sweep = 0;
			}
			// Normalise to -1..1, then damp. A lamp across the room moves
			// much less than the cursor does; full range reads as a gimmick.
			x = ((e.clientX / window.innerWidth) * 2 - 1) * 0.6;
			y = ((e.clientY / window.innerHeight) * 2 - 1) * 0.6 - 0.55;
			if (!frame) frame = requestAnimationFrame(paint);
		};

		const step = (now: number) => {
			if (taken) return;
			if (!sweepFrom) sweepFrom = now;

			const t = Math.min((now - sweepFrom) / SWEEP_MS, 1);
			// Eased time through half a sine, so the lamp leaves rest,
			// crosses the desk and returns to exactly where it started
			// rather than stopping somewhere arbitrary.
			const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
			const arc = Math.sin(eased * Math.PI);
			x = REST_X + arc * 0.95;
			y = REST_Y + arc * 0.24;
			write();

			if (t < 1) {
				sweep = requestAnimationFrame(step);
				return;
			}
			// Landed back at rest, which is what the stylesheet defaults
			// already say. Hand the variables back rather than pinning them.
			sweep = 0;
			root.style.removeProperty("--lx");
			root.style.removeProperty("--ly");
		};

		const cue = setTimeout(() => {
			if (!taken) sweep = requestAnimationFrame(step);
		}, SWEEP_DELAY);

		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			clearTimeout(cue);
			if (frame) cancelAnimationFrame(frame);
			if (sweep) cancelAnimationFrame(sweep);
			root.style.removeProperty("--lx");
			root.style.removeProperty("--ly");
		};
	}, []);

	return null;
}
