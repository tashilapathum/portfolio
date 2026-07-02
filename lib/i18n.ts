// Self-contained i18n helpers for the project legal pages (privacy / terms /
// deletion). Locale lives in MDX frontmatter (`lang`) and as an optional
// trailing URL segment; nothing here touches the rest of the site.

export type Locale = {
	/** BCP-47 code used in URLs, filenames and the `lang` attribute. */
	code: string;
	/** Endonym shown in the language switcher. */
	nativeName: string;
};

/**
 * All locales the legal pages may be translated into, in display order.
 * A locale only appears in the UI once a matching MDX file actually exists,
 * so this list can stay ahead of the available translations.
 */
export const SUPPORTED_LOCALES: Locale[] = [
	{ code: "en", nativeName: "English" },
	{ code: "si", nativeName: "සිංහල" },
	{ code: "ja", nativeName: "日本語" },
	{ code: "ko", nativeName: "한국어" },
	{ code: "de", nativeName: "Deutsch" },
	{ code: "es", nativeName: "Español" },
	{ code: "fr", nativeName: "Français" },
	{ code: "ru", nativeName: "Русский" },
	{ code: "hi", nativeName: "हिन्दी" },
	{ code: "zh-cn", nativeName: "中文" },
	{ code: "pt-br", nativeName: "Português (Brasil)" },
	{ code: "tr", nativeName: "Türkçe" },
	{ code: "id", nativeName: "Bahasa Indonesia" },
	{ code: "vi", nativeName: "Tiếng Việt" },
	{ code: "th", nativeName: "ไทย" },
];

export const DEFAULT_LOCALE = "en";

const SUPPORTED_CODES = new Set(SUPPORTED_LOCALES.map((l) => l.code));

export function isSupportedLocale(code: string): boolean {
	return SUPPORTED_CODES.has(code);
}

export function nativeName(code: string): string {
	return SUPPORTED_LOCALES.find((l) => l.code === code)?.nativeName ?? code;
}

/**
 * Given an `Accept-Language` header value and the locales that actually have
 * content, return the best match (or the default locale when nothing fits).
 *
 * Browser tags are matched case-insensitively against our codes, first exactly
 * (e.g. `zh-CN` → `zh-cn`) and then by primary subtag (e.g. `zh-HK` → `zh-cn`,
 * `pt` → `pt-br`), honouring quality (`q=`) weights.
 */
export function pickLocale(
	acceptLanguage: string | null | undefined,
	availableCodes: string[],
): string {
	const available = availableCodes.filter(isSupportedLocale);
	if (!acceptLanguage || available.length === 0) return DEFAULT_LOCALE;

	const requested = acceptLanguage
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const qParam = params.find((p) => p.trim().startsWith("q="));
			const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
			return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
		})
		.filter((r) => r.tag && r.q > 0)
		.sort((a, b) => b.q - a.q);

	for (const { tag } of requested) {
		// Exact match: `zh-cn` === `zh-cn`.
		const exact = available.find((c) => c === tag);
		if (exact) return exact;
		// Primary-subtag match: `zh` (from `zh-hk`) matches available `zh-cn`.
		const primary = tag.split("-")[0];
		const byPrimary = available.find((c) => c.split("-")[0] === primary);
		if (byPrimary) return byPrimary;
	}

	return DEFAULT_LOCALE;
}
