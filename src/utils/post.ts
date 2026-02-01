import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw"; // 👈 parse raw HTML into AST
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "public/posts");

export interface PostData {
  id: string;
  title: string;
  date: string;
  contentHtml: string;
}

/**
 * Sanitization schema allowing <img> with width, height, alt, and src
 */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img || []),
      "width",
      "height",
      "alt",
      "src",
    ],
  },
};

/**
 * Convert [[image.png][width][height][alt]] into <img> HTML tags
 */
function parseImages(content: string) {
  return content.replace(
    /!\[\[([^\]]+)\]\](?:\[(\d+)\])?(?:\[(\d+)\])?(?:\[(.*?)\])?/g,
    (_, src, width, height, alt) => {
      // No leading slash if images are directly in /public
      const cleanSrc = `${src.trim()}`;
      const w = width ? ` width="${width}"` : "";
      const h = height ? ` height="${height}"` : "";
      const a = alt ? ` alt="${alt.trim()}"` : ' alt=""';
      return `<img src="${cleanSrc}"${w}${h}${a} />`;
    },
  );
}

/**
 * Read a single markdown post, parse and sanitize HTML
 */
export async function getPost(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");

  const matterResult = matter(fileContents);

  // Step 1: convert our custom image syntax into raw HTML
  const preprocessedMarkdown = parseImages(matterResult.content);

  // Step 2: Convert markdown → HTML AST → raw HTML parsing → sanitize → string
  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true }) // keeps raw HTML in md
    .use(rehypeRaw) // parses injected HTML into AST
    .use(rehypeSanitize, schema) // removes unsafe elements/attributes
    .use(rehypeStringify)
    .process(preprocessedMarkdown);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { title: string; date: string }),
  };
}

/**
 * Read all markdown posts
 */
export async function getAllPosts(): Promise<PostData[]> {
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md")) // only markdown
      .map(async (file) => {
        const id = file.replace(/\.md$/, "");
        return getPost(id);
      }),
  );

  return posts;
}

/**
 * Format date YYYY-MM-DD -> "Month DD, YYYY"
 */
export function formatDate(date: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [year, month, day] = date.split("-");
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}
