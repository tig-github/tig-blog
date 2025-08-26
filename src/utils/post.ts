import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { POST_DIRECTORY } from "./const";
import { readdir } from "fs/promises";

const getPost = async (id: string) => {
  const fullPath = path.join(POST_DIRECTORY, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const post = await remark().use(html).process(matterResult.content);
  const contentHtml = parseImages(post.toString());
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};

const getAllPosts = async () => {
  const files = await readdir(POST_DIRECTORY);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const id = file.slice(0, -3);
        return await getPost(id);
      })
  );
  return posts;
};

const parseImages = (content: string) => {
  return content.replace(
    /!\[\[([^\]]+)\]\](?:\[(\d+)\])?(?:\[(\d+)\])?(?:\[(.*?)\])?/g,
    (_, src, width, height, alt) => {
      const cleanSrc = src.trim();
      const widthAttr = width ? ` width="${width}"` : "";
      const heightAttr = height ? ` height="${height}"` : "";
      const altAttr = alt ? ` alt="${alt.trim()}"` : ' alt=""';

      return `<img src="${cleanSrc}"${widthAttr}${heightAttr}${altAttr} />`;
    }
  );
};

const formatDate = (date: string) => {
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
  const formattedDate = `${months[parseInt(month, 10) - 1]} ${parseInt(
    day,
    10
  )}, ${year}`;

  return formattedDate;
};

export { getPost, getAllPosts, formatDate };
