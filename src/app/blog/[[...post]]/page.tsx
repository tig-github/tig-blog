import { getPost, formatDate } from "../../../utils/post";
import styles from "../blog.module.css";

interface PageProps {
  params: { post: string };
}

export default async function Page(params: PageProps) {
  let post: any = await getPost(params.params.post);
  return (
    <div className={styles.blog}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.date}>{formatDate(post.date)}</div>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </div>
  );
}
