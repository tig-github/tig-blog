import { getAllPosts, formatDate } from "../../utils/post";
import styles from "./blog.module.css";
import Link from "next/link";

export default async function Posts() {
  const posts = await getAllPosts();
  return (
    <div className={styles.blog}>
      <h1 className={styles.blogTitle}>All Blog Posts</h1>
      <div className={styles.entryList}>
        {[...posts].reverse().map((post: any) => {
          return (
            <div className={styles.entry} key={post.id}>
              <div className={styles.entryTitle}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </div>
              <div className={styles.entryDate}>{formatDate(post.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
