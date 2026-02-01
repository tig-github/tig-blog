import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "public/posts");

export interface PostData {
  id: string;
  title: string;
  date: string;
  contentHtml: string;
}

export async function getPost(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);

  const fileContents = await fs.readFile(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype) // markdown -> HTML AST
    .use(rehypeSanitize) // sanitize against XSS
    .use(rehypeStringify) // HTML AST -> string
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { title: string; date: string }),
  };
}

export async function getAllPosts(): Promise<PostData[]> {
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const id = file.replace(/\.md$/, "");
        return getPost(id);
      }),
  );

  return posts;
}

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
