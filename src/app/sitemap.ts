import type { MetadataRoute } from "next";
import { getAllPosts } from "../utils/post";
import { SITE_URL } from "../utils/site";

function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    {
      url: absoluteUrl(""),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`blog/${encodeURIComponent(post.id)}`),
      lastModified: new Date(`${post.date}T00:00:00.000Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
