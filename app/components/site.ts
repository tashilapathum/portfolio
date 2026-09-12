/** Single source of truth for identity and contact details. Sourced from CV.pdf. */
export const SITE = {
	name: "Tashila Pathum",
	fullName: "Tashila Pathum Bandara",
	role: "Senior Software Engineer",
	subRole: "Native Android Engineer",
	location: "Colombo, Sri Lanka",
	email: "hello@tashila.me",
	resume: "/CV.pdf",
	avatar: "https://avatars.githubusercontent.com/u/43470527",
	links: {
		github: "https://github.com/tashilapathum",
		linkedin: "https://linkedin.com/in/tashilapathum",
		playStore: "https://play.google.com/store/apps/developer?id=Tashila+Pathum",
	},
} as const;

export const STATS = [
	{ value: "7+", label: "Years shipping" },
	{ value: "15+", label: "Apps on Play" },
	{ value: "200k+", label: "Users reached" },
	{ value: "4", label: "Libraries published" },
] as const;

/** Spells a small number for display copy; falls back to digits. */
const WORDS = [
	"Zero",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen",
	"Twenty",
	"Twenty-one",
	"Twenty-two",
	"Twenty-three",
	"Twenty-four",
	"Twenty-five",
];

export function spell(n: number): string {
	return WORDS[n] ?? String(n);
}
