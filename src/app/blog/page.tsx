import { getAllPosts } from "../../utils/post";
import styles from "./blog.module.css";
import BlogSearch from "../../components/BlogSearch";

export default async function Posts() {
  const posts = await getAllPosts();
  return (
    <div className={styles.blog}>
      <h1 className={styles.blogTitle}>All Blog Posts</h1>
      <BlogSearch posts={posts.map(({ id, title, date, searchText }) => ({ id, title, date, searchText }))} />
    </div>
  );
}
