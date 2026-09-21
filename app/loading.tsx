import { Main, Paper } from "./components/paper";

/**
 * A sheet still being drawn.
 *
 * Shaped like the page that is coming rather than a spinner, so the
 * layout does not jump when the real content lands. Pinned flat: it is
 * not something you could pick up yet.
 */
export default function Loading() {
	return (
		<Main className="max-w-3xl">
			<div className="h-7 w-28 rounded-[2px] bg-rule/10" />
			<div className="mt-6 h-11 w-3/4 rounded-[2px] bg-rule/10" />
			<div className="mt-3.5 h-11 w-1/2 rounded-[2px] bg-rule/10" />

			<Paper curl={0} className="mt-10">
				<div className="grid gap-4 p-8">
					<div className="h-3.5 w-full rounded-[2px] bg-rule/[.07]" />
					<div className="h-3.5 w-11/12 rounded-[2px] bg-rule/[.07]" />
					<div className="h-3.5 w-4/5 rounded-[2px] bg-rule/[.07]" />
				</div>
			</Paper>
		</Main>
	);
}
