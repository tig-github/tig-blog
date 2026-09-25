"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./blogSearch.module.css";

type SearchPost = {
  id: string;
  title: string;
  date: string;
  searchText: string;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogSearch({ posts }: { posts: SearchPost[] }) {
  const [query, setQuery] = useState("");
  const filteredPosts = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return [...posts]
      .reverse()
      .map((post, index) => {
        const title = post.title.toLocaleLowerCase();
        const content = post.searchText.toLocaleLowerCase();
        const titleMatch = terms.every((term) => title.includes(term));
        const contentMatch = terms.every((term) =>
          `${title} ${content}`.includes(term),
        );
        return { post, index, titleMatch, contentMatch };
      })
      .filter(({ contentMatch }) => contentMatch)
      .sort(
        (a, b) =>
          Number(b.titleMatch) - Number(a.titleMatch) || a.index - b.index,
      )
      .map(({ post }) => post);
  }, [posts, query]);

  return (
    <>
      <input
        className={styles.searchInput}
        id="post-search"
        type="search"
        placeholder="Search titles and content"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {filteredPosts.length > 0 ? (
        <div className={styles.entryList}>
          {filteredPosts.map((post) => (
            <div className={styles.entry} key={post.id}>
              <div className={styles.entryTitle}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </div>
              <div className={styles.entryDate}>{formatDate(post.date)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noResults} role="status">
          No posts found. Try a different search.
        </p>
      )}
    </>
  );
}
