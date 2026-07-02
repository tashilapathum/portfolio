import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allLegalPages } from "contentlayer/generated";
import { DEFAULT_LOCALE, isSupportedLocale, pickLocale } from "@/lib/i18n";

// Only bare legal URLs (no locale segment) are matched — see `config` below.
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const match = pathname.match(/^\/projects\/([^/]+)\/(privacy|terms|deletion)\/?$/);
	if (!match) return NextResponse.next();

	const [, slug, type] = match;

	// Locales that actually have a translation for this page.
	const available = allLegalPages
		.filter((p) => p.projectSlug === slug && p.pageType === type)
		.map((p) => p.lang);
	if (available.length <= 1) return NextResponse.next();

	// A saved preference wins over browser detection.
	const cookie = request.cookies.get("NEXT_LOCALE")?.value;
	const chosen =
		cookie && isSupportedLocale(cookie) && available.includes(cookie)
			? cookie
			: pickLocale(request.headers.get("accept-language"), available);

	// English is the canonical URL — leave it untouched.
	if (chosen === DEFAULT_LOCALE) return NextResponse.next();

	const url = request.nextUrl.clone();
	url.pathname = `/projects/${slug}/${type}/${chosen}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: [
		"/projects/:slug/privacy",
		"/projects/:slug/terms",
		"/projects/:slug/deletion",
	],
};
