"use client";
import { useEffect } from "react";
import { Button, Main, Paper, Title } from "./components/paper";

/**
 * A spoiled sheet.
 *
 * Says what happened and offers the one useful action. The digest is
 * shown because it is the only thing a visitor can actually quote back
 * in a bug report; the message itself is not, since it can carry
 * internals.
 */
export default function ErrorSheet({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Main className="max-w-3xl">
			<Paper curl={2} tilt={-0.6}>
				<div className="p-8 sm:p-12">
					<div className="font-mono text-[10.5px] uppercase tracking-[.2em] text-vermillion">
						Spoiled sheet
					</div>

					<Title as="h1" className="mt-6 text-[32px] sm:text-[44px]">
						Something tore on the way out.
					</Title>

					<p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-graphite-soft">
						This page failed to render. Trying again usually works; if it does
						not, the reference below is the useful part of a bug report.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<button
							type="button"
							onClick={reset}
							className="cardboard inline-flex items-center justify-center rounded-[2px] px-6 py-3 text-sm font-semibold tracking-tight text-kraft-ink"
						>
							Try again
						</button>
						<Button href="/" variant="quiet">
							Back to the desk
						</Button>
					</div>

					{error.digest && (
						<div className="mt-8 border-t border-rule/15 pt-5 font-mono text-[10.5px] uppercase tracking-[.16em] text-graphite-faint">
							Reference {error.digest}
						</div>
					)}
				</div>
			</Paper>
		</Main>
	);
}
