import { Annotation, Button, Main, Paper, Title } from "./components/paper";

/**
 * A blank sheet.
 *
 * Deliberately almost empty: the joke only works if the page looks like
 * a drawing that was never made. No search box, no link grid, no
 * "helpful suggestions". One note in red pen and a way back.
 */
export default function NotFound() {
	return (
		<Main className="max-w-3xl">
			<Paper curl={2} tilt={-0.8}>
				<div className="flex min-h-[320px] flex-col justify-between p-8 sm:min-h-[400px] sm:p-12">
					<div className="font-mono text-[10.5px] uppercase tracking-[.2em] text-graphite-faint">
						Sheet 404
					</div>

					<Title as="h1" className="text-[38px] sm:text-[54px]">
						Sheet not found.
					</Title>

					<div className="flex flex-wrap items-end justify-between gap-6">
						<Button href="/">Back to the desk</Button>
						<Annotation className="max-w-[24ch]" tilt={-2.4} write={false}>
							nothing was ever drawn here
						</Annotation>
					</div>
				</div>
			</Paper>
		</Main>
	);
}
