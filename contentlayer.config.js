import {
	defineDocumentType,
	defineNestedType,
	makeSource,
} from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { format } from "date-fns";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	path: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
};

/** A label/value pair — powers the fact cards and the spec table. */
const Fact = defineNestedType(() => ({
	name: "Fact",
	fields: {
		label: { type: "string", required: true },
		value: { type: "string", required: true },
	},
}));

/** A short engineering note rendered as a card. */
const Note = defineNestedType(() => ({
	name: "Note",
	fields: {
		title: { type: "string", required: true },
		body: { type: "string", required: true },
	},
}));

export const Project = defineDocumentType(() => ({
	name: "Project",
	filePathPattern: "./projects/**/index.mdx",
	contentType: "mdx",

	fields: {
		published: {
			type: "boolean",
		},
		agreements: {
			type: "boolean",
		},
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
		},
		url: {
			type: "string",
		},
		repository: {
			type: "string",
		},
		category: {
			type: "string",
		},
		tech: {
			type: "list",
			of: { type: "string" },
		},
		/** Wide shot used on the projects index and as the detail hero. */
		image: {
			type: "string",
		},
		imageAlt: {
			type: "string",
		},
		/** Detail-page hero, when it should differ from the index shot. */
		hero: {
			type: "string",
		},
		/** "cover" (default) crops to the frame; "contain" shows the whole image. */
		imageFit: {
			type: "string",
		},
		/**
		 * Fit for the hero specifically. Defaults to `imageFit`. "banner" crops like
		 * "cover" and adds grain, scanlines and a vignette to hide a low-res graphic.
		 */
		heroFit: {
			type: "string",
		},
		/** CSS object-position for a "banner" hero crop. Defaults to "50% 40%". */
		heroPosition: {
			type: "string",
		},
		/** Portrait shot shown in the case-study sidebar. */
		portrait: {
			type: "string",
		},
		/** 1-4 promotes the project to a full-scale act on the index. */
		featured: {
			type: "number",
		},
		tagline: {
			type: "string",
		},
		role: {
			type: "string",
		},
		/** The four fact cards under the detail hero. */
		facts: {
			type: "list",
			of: Fact,
		},
		/** The hairline spec table. */
		specs: {
			type: "list",
			of: Fact,
		},
		/** The engineering-notes grid. */
		notes: {
			type: "list",
			of: Note,
		},
	},
	computedFields,
}));

export const Page = defineDocumentType(() => ({
	name: "Page",
	filePathPattern: "pages/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
		},
	},
	computedFields,
}));

export const LegalPage = defineDocumentType(() => ({
	name: "LegalPage",
	filePathPattern: "./projects/**/(privacy|terms|deletion)?(.*).mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		pageType: {
			type: "enum",
			options: ["privacy", "terms", "deletion"],
			required: true,
		},
		projectSlug: {
			type: "string",
			required: true,
			description: "Slug of the parent project",
		},
		lang: {
			type: "enum",
			options: [
				"en",
				"si",
				"ja",
				"ko",
				"de",
				"es",
				"fr",
				"ru",
				"hi",
				"zh-cn",
				"pt-br",
				"tr",
				"id",
				"vi",
				"th",
			],
			default: "en",
			description: "BCP-47 language code of this translation",
		},
	},
	computedFields,
}));

export const BlogPost = defineDocumentType(() => ({
	name: "BlogPost",
	filePathPattern: "./blog/*.mdx",
	contentType: "mdx",
	fields: {
		published: {
			type: "boolean",
			default: true,
		},
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
			required: true,
		},
	},
	computedFields: {
		...computedFields,
		formattedDate: {
			type: "string",
			resolve: (doc) => format(new Date(doc.date), "MMMM dd, yyyy"),
		},
		readingTime: {
			type: "number",
			resolve: (doc) =>
				Math.max(1, Math.ceil(doc.body.raw.trim().split(/\s+/).length / 200)),
		},
	},
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Page, Project, LegalPage, BlogPost],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					// Both stocks. Shiki writes each token twice, as
					// `--shiki-light` and `--shiki-dark` custom properties,
					// and `mdx.css` picks the pair that matches the theme.
					// A single dark theme left a black code island sitting on
					// manila.
					theme: { light: "github-light", dark: "github-dark" },
					onVisitLine(node) {
						// Prevent lines from collapsing in `display: grid` mode, and allow empty
						// lines to be copy/pasted
						if (node.children.length === 0) {
							node.children = [{ type: "text", value: " " }];
						}
					},
					onVisitHighlightedLine(node) {
						node.properties.className.push("line--highlighted");
					},
					onVisitHighlightedWord(node) {
						node.properties.className = ["word--highlighted"];
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
		],
	},
});
