import { getAllPosts, formatDate } from "../utils/post";
import styles from "./page.module.css";
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      {[...posts].reverse().map((post) => (
        <div className={styles.blog} key={post.id}>
          <h2 className={styles.title}>
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
          </h2>
          <div className={styles.date}>{formatDate(post.date)}</div>
          <article
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      ))}
    </div>
  );
}
