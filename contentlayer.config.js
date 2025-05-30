import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { format } from 'date-fns';

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
	filePathPattern: "./projects/**/(privacy|terms).mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		pageType: {
			type: "enum",
			options: ["privacy", "terms"],
			required: true
		},
		projectSlug: {
			type: "string",
			required: true,
			description: "Slug of the parent project (e.g., 'my-android-app')"
		},
	},
	computedFields
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
					theme: "github-dark",
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
